import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';

const fromAuthHeaderAsBearerToken = (): JwtFromRequestFunction => (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return;
  if (authHeader.split(' ')[1] && authHeader.split(' ')[0] === 'Bearer')
    return authHeader.split(' ')[1];
  return;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        //ExtractJwt.fromAuthHeaderAsBearerToken(),
        fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'popaEremeia',
    });
  }

  async validate(payload) {
    if (payload.typ !== 'access')
      throw new UnauthorizedException('Неверный тип токена');
    const user = await this.userService.findOne({ id: payload.uId });
    return user.item;
  }
}
