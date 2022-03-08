import { Req, Res } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response, Request } from 'express';
import { StatusModel } from 'src/common/others.model';
import { ItemUserModel, UserModel } from 'src/user/user.model';
import { ForAuth } from './auth.guard';
import { AuthService } from './auth.service';
import { REFRESH_TOKEN } from './consts';
import { CurUser } from './curuser.dec';
import { LoginArgs } from './dto/args/login.arg';
import { RegisterInput } from './dto/args/reg.input';
import { TokenItemUser } from './token.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => TokenItemUser)
  async login(
    @Args() args: LoginArgs,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenItemUser> {
    const resp = await this.authService.login(args);
    if (args.enableCookie) this.authService.setAuthCookies(res, resp.token);
    return resp;
  }

  @Query(() => TokenItemUser)
  async refresh(
    @Args('refresh') refresh: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Args('enableCookies') enableCookies?: boolean,
  ): Promise<TokenItemUser> {
    const resp = await this.authService.refresh(refresh);
    const notEnableCookies =
      !enableCookies && typeof enableCookies !== 'undefined';
    if ((req.cookies[REFRESH_TOKEN] && !notEnableCookies) || enableCookies)
      this.authService.setAuthCookies(res, resp.token);
    return resp;
  }

  @Query(() => ItemUserModel)
  @ForAuth()
  async whoIAm(@CurUser() me: UserModel) {
    return { item: me };
  }

  // Мутации
  @Mutation(() => TokenItemUser)
  async reg(
    @Args('registerInput') registerInput: RegisterInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenItemUser> {
    const resp = await this.authService.reg(registerInput);
    if (registerInput.enableCookie)
      this.authService.setAuthCookies(res, resp.token);
    return resp;
  }

  @Mutation(() => StatusModel)
  async deleteAuthCookies(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StatusModel> {
    this.authService.deleteAuthCookies(res);
    return { isOk: true };
  }
}
