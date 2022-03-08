import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

// DTO
import { Register } from './dto/register.dto';
import { FindAllArgs as FindAll } from './dto/findAll.dto';
import { FindOneArgs as FindOne } from './dto/findOne.dto';
import { Login } from './dto/login.dto';
import { CountryService } from 'src/country/country.service';
import { pubSub, pubEvent } from 'src/app.service';
import {
  DualUserModel,
  ItemUserModel,
  ManyUserModel,
  TokenItemUser,
} from './user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => CountryService))
    private countryService: CountryService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  async findAll({ limit, page }: FindAll): Promise<ManyUserModel> {
    const [items, summ] = await this.usersRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit * page,
    });
    return { items, info: { limit, summ, page } };
  }

  async findOne({
    articleId,
    countryId,
    id,
    orgId,
    vkId,
    username,
    cartId,
  }: FindOne): Promise<ItemUserModel> {
    let where: FindConditions<UserEntity>;
    if (articleId) where = { ...where, articles: [{ id: articleId }] };
    if (orgId) where = { ...where, orgs: [{ id: orgId }] };
    if (cartId) where = { ...where, sales: [{ id: cartId }] };
    if (id) where = { ...where, id };
    if (countryId)
      where = {
        ...where,
        id: (await this.countryService.findOne({ id: countryId }, ['user']))
          .item.user.id,
      };
    if (vkId) where = { ...where, vkId };
    if (username) where = { ...where, username };
    const item = await this.usersRepository.findOne({
      where,
    });
    if (!item)
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    return { item };
  }

  async login({
    vkId,
    vkHash,
    username,
    password,
  }: Login): Promise<TokenItemUser> {
    let item: UserEntity;
    if (vkId && vkHash)
      item = await this.usersRepository.findOne({ where: { vkId } });
    if (username)
      item = await this.usersRepository.findOne({
        where: { username: username },
      });
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
      (await this.usersRepository.findOne({ where: { username } })) ||
      (await this.usersRepository.findOne({ where: { vkId } }))
    )
      throw new HttpException(
        'Такой пользователь уже есть, выполните от его имени вход',
        HttpStatus.BAD_REQUEST,
      );
    const passwordH = await hash(password, 10);
    const item = this.usersRepository.create({
      password: passwordH,
      ...data,
      username,
      vkId,
    });
    await this.usersRepository.save(item);
    return { item, token: this.createTokens(item.id) };
  }

  async refresh(refresh: string): Promise<TokenItemUser> {
    const object = this.jwtService.verify(refresh);
    if (object.typ !== 'refresh')
      throw new UnauthorizedException('Неверный тип токена');
    const { item } = await this.findOne({ id: object.uId });
    return { item, token: this.createTokens(object.uId) };
  }

  async getFromToken(access: string) {
    const object = this.jwtService.verify(access);
    if (object.typ !== 'access')
      throw new UnauthorizedException('Неверный тип токена');
    const item = await this.usersRepository.findOne(object.uId);
    return { item };
  }

  async deleteUser(
    user: UserEntity,
    { username, password }: { password: string; username: string },
  ): Promise<boolean> {
    if (user.username !== username || (await compare(password, user.password)))
      throw new HttpException(
        'Пароль и/или логин не верны',
        HttpStatus.BAD_REQUEST,
      );
    await this.usersRepository.remove(user);
    return true;
  }

  async levelControl(
    user: UserEntity,
    { to, id }: { to: 'down' | 'up'; id: number },
  ): Promise<ItemUserModel> {
    const { item } = await this.findOne({ id });
    switch (to) {
      case 'down':
        if (item.levelAccess - 1 < 1)
          throw new HttpException(
            'Ниже 1 уровня понижать пользователя нельзя',
            HttpStatus.BAD_REQUEST,
          );
        item.levelAccess -= 1;
        break;

      default:
        if (item.levelAccess + 1 >= user.levelAccess)
          throw new HttpException(
            `Выше вашего уровня повышать нельзя пользователя нельзя, для вас максиум - ${
              user.levelAccess - 1
            }`,
            HttpStatus.BAD_REQUEST,
          );
        item.levelAccess += 1;
        break;
    }
    await pubEvent({
      title: `${to === 'down' ? 'Понижение' : 'Повышение'} уровня!`,
      forId: item.id,
      text: `
                ${
                  to === 'down'
                    ? 'Ну и ну! Вы злоупотребляли возможностями администрации. Поэтому -1 уровень доступа'
                    : 'Вы обрадовали администрацию НБМ! +1 уровень доступа - тебе'
                }. Ваш текущий уровень - ${item.levelAccess}.
            `,
      isCool: to === 'up',
      typ: 'level',
    });
    await this.usersRepository.save(item);
    return { item };
  }

  async pay(
    user: UserEntity,
    { summ, id }: { summ: number; id: number },
  ): Promise<DualUserModel> {
    const { item } = await this.findOne({ id });
    if (user.balance < summ)
      throw new HttpException(
        `Для перевода не хватает средств (${
          user.balance - summ
        }). Текущий баланс - ${user.balance}`,
        HttpStatus.BAD_REQUEST,
      );
    user.balance -= summ;
    item.balance += summ;
    await pubEvent({
      title: `Пополнение!`,
      forId: item.id,
      text: `Здравствуйте, вам пополнение от ${
        user.nick ? user.nick : user.username
      }! Размер пополнения ${summ}!`,
      isCool: true,
      typ: 'pay',
      img: user.img,
    });
    await this.usersRepository.save([item, user]);
    return { user1: user, user2: item };
  }

  async update(
    user: UserEntity,
    { desc, img, nick }: { desc?: string; img?: string; nick?: string },
  ): Promise<ItemUserModel> {
    user.img = img;
    user.nick = nick;
    user.desc = desc;
    await this.usersRepository.save(user);
    return { item: user };
  }

  async updatePassword(
    user: UserEntity,
    {
      passwordOld,
      passwordNew1,
    }: { passwordOld: string; passwordNew1: string },
  ): Promise<ItemUserModel> {
    if (!(await compare(passwordOld, user.password)))
      throw new HttpException('Неверный старый пароль', HttpStatus.BAD_REQUEST);
    user.password = await hash(passwordNew1, 10);
    await this.usersRepository.save(user);
    return { item: user };
  }

  async updateUsername(
    user: UserEntity,
    { username, password }: { username?: string; password?: string },
  ): Promise<ItemUserModel> {
    if (!(await compare(password, user.password)))
      throw new HttpException('Неверный старый пароль', HttpStatus.BAD_REQUEST);
    user.username = username;
    await this.usersRepository.save(user);
    return { item: user };
  }

  async gift(
    user: UserEntity,
    { summ, id }: { summ: number; id: number },
  ): Promise<ItemUserModel> {
    const { item } = await this.findOne({ id });
    item.balance += summ;
    await pubEvent({
      title: `Награждение!`,
      forId: item.id,
      text: `Здраствуйте, вы обрадовали Администрацию НБМ, поэтому вы получаете ${summ}!`,
      isCool: true,
      typ: 'pay',
    });
    await this.usersRepository.save(item);
    return { item };
  }
  async penalty(
    user: UserEntity,
    { summ, id }: { summ: number; id: number },
  ): Promise<ItemUserModel> {
    const { item } = await this.findOne({ id });
    item.balance -= summ;
    await this.usersRepository.save(item);
    await pubEvent({
      title: `Тоби пизда!`,
      forId: item.id,
      text: `Здраствуйте, вы разозлили Администрацию НБМ, поэтому вы получаете пизды и -${summ}!`,
      isCool: false,
      typ: 'pay',
    });
    return { item };
  }

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

  async save(user: UserEntity[]) {
    return await this.usersRepository.save(user);
  }
}
