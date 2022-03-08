import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Login } from './dto/login.dto';
import { Register } from './dto/register.dto';
import { TokenItemUser, TokenModel } from './token.model';
import { Response } from 'express';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './consts';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  validateToken(token: string) {
    try {
      const item = this.jwtService.verify(token);
      return { item, status: true };
    } catch (e) {
      return { item: e, status: false };
    }
  }

  createTokens(id: number) {
    return {
      access_token: this.jwtService.sign(
        { uId: id, typ: 'access' },
        { expiresIn: '30m' },
      ),
      refresh_token: this.jwtService.sign(
        { uId: id, typ: 'refresh' },
        { expiresIn: '30d' },
      ),
    };
  }

  setAuthCookies(res: Response, token: TokenModel) {
    res.cookie(ACCESS_TOKEN, token.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 30),
    });
    res.cookie(REFRESH_TOKEN, token.refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
  }

  deleteAuthCookies(res: Response) {
    res.cookie(ACCESS_TOKEN, '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }

  async login({
    vkId,
    vkHash,
    username,
    password,
  }: Login): Promise<TokenItemUser> {
    let item: UserEntity;
    if (vkId && vkHash) item = (await this.userService.findOne({ vkId })).item;
    if (username) item = (await this.userService.findOne({ username })).item;
    if (!(vkId && vkHash) && item)
      if (!(await compare(password, item.password))) item = undefined;
    if (!item)
      throw new HttpException(
        'Пароль и/или логин не верны',
        HttpStatus.BAD_REQUEST,
      );
    return { item, token: this.createTokens(item.id) };
  }

  async reg({
    username,
    vkId,
    password,
    ...data
  }: Register): Promise<TokenItemUser> {
    if (
      (await this.userService.findOne({ username })).item ||
      (await this.userService.findOne({ vkId })).item
    )
      throw new HttpException(
        'Такой пользователь уже есть, выполните от его имени вход',
        HttpStatus.BAD_REQUEST,
      );
    const passwordH = await hash(password, 10);
    const item = this.userRepository.create({
      password: passwordH,
      ...data,
      username,
      vkId,
    });
    await this.userService.save([item]);
    return { item, token: this.createTokens(item.id) };
  }

  async refresh(refresh: string): Promise<TokenItemUser> {
    const object = this.jwtService.verify(refresh);
    if (object.typ !== 'refresh')
      throw new UnauthorizedException('Неверный тип токена');
    const { item } = await this.userService.findOne({ id: object.uId });
    return { item, token: this.createTokens(object.uId) };
  }

  async getFromToken(access: string) {
    const object = this.jwtService.verify(access);
    if (object.typ !== 'access')
      throw new UnauthorizedException('Неверный тип токена');
    const item = await this.userRepository.findOne(object.uId);
    return { item };
  }
}
