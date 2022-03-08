import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Context,
} from '@nestjs/graphql';
import { ArticleService } from 'src/article/article.service';
import { CountryService } from 'src/country/country.service';
import { OrgService } from 'src/org/org.service';
import {
  DualUserModel,
  ItemUserModel,
  ManyUserModel,
  TokenItemUser,
  UserModel,
} from './user.model';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { FindAllArgs } from './dto/args/findAll.arg';
import { LoginArgs } from './dto/args/login.arg';
import { RegisterInput } from './dto/args/reg.input';
import { FindOneArgs } from './dto/args/findOne';
import { ArticleModel } from 'src/article/article.model';
import { ForAuth } from './auth.guard';
import { CurUser } from './curuser.dec';
import { UserEntity } from './user.entity';
import { PayInput, StatusModel } from 'src/others.model';
import { DeleteArgs } from './dto/args/delete.input';
import {
  EditInput,
  EditPasswordInput,
  EditUsernameInput,
} from './dto/args/edit.input';
import { LevelInput } from './dto/args/level.input';
import { SaleModel } from 'src/product/models/product.model';
import { CountryModel } from 'src/country/country.model';
import { OrgModel } from 'src/org/org.model';
import { CartService } from 'src/product/cart.service';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private userService: UserService,
    private articleService: ArticleService,
    private cartService: CartService,
    private orgService: OrgService,
    private countryService: CountryService,
  ) {}

  // Запросы
  @Query(() => ManyUserModel)
  async findAllUser(
    @Args({ nullable: true }) args: FindAllArgs,
  ): Promise<ManyUserModel> {
    return await this.userService.findAll(args);
  }

  @Query(() => ItemUserModel)
  async findUser(@Args() args: FindOneArgs): Promise<ItemUserModel> {
    return await this.userService.findOne(args);
  }

  @Query(() => TokenItemUser)
  async login(@Args() args: LoginArgs): Promise<TokenItemUser> {
    const resp = await this.userService.login(args);
    return resp;
  }

  @Query(() => TokenItemUser)
  async refresh(@Args('refresh') refresh: string): Promise<TokenItemUser> {
    const resp = await this.userService.refresh(refresh);
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
  ): Promise<TokenItemUser> {
    const resp = await this.userService.reg(registerInput);
    return resp;
  }

  @ForAuth()
  @Mutation(() => StatusModel)
  async delete(
    @CurUser() user: UserEntity,
    @Args('deleteUser') args: DeleteArgs,
  ) {
    const result = await this.userService.deleteUser(user, args);
    return { isOk: result };
  }

  @ForAuth()
  @Mutation(() => ItemUserModel)
  async editUser(
    @CurUser() user: UserEntity,
    @Args('editUser') args: EditInput,
  ) {
    const item = await this.userService.update(user, args);
    return item;
  }

  @ForAuth()
  @Mutation(() => ItemUserModel)
  async editPassword(
    @CurUser() user: UserEntity,
    @Args('updatePassword') args: EditPasswordInput,
  ) {
    const item = await this.userService.updatePassword(user, args);
    return item;
  }

  @ForAuth()
  @Mutation(() => ItemUserModel)
  async editUsername(
    @CurUser() user: UserEntity,
    @Args('updateUsername') args: EditUsernameInput,
  ): Promise<ItemUserModel> {
    const item = await this.userService.updateUsername(user, args);
    return item;
  }

  @ForAuth()
  @Mutation(() => DualUserModel)
  async payUser(@CurUser() user: UserEntity, @Args('payUser') args: PayInput) {
    const item = await this.userService.pay(user, args);
    return item;
  }

  @ForAuth(3)
  @Mutation(() => ItemUserModel)
  async levelControl(
    @CurUser() user: UserEntity,
    @Args('payUser') args: LevelInput,
  ): Promise<ItemUserModel> {
    const to: 'up' | 'down' = args.to ? 'up' : 'down';
    const item = await this.userService.levelControl(user, { to, id: args.id });
    return item;
  }

  @ForAuth(3)
  @Mutation(() => ItemUserModel)
  async penaltyUser(
    @CurUser() user: UserEntity,
    @Args('penaltyUser') args: PayInput,
  ): Promise<ItemUserModel> {
    const item = await this.userService.penalty(user, args);
    return item;
  }

  @ForAuth(3)
  @Mutation(() => ItemUserModel)
  async giftUser(
    @CurUser() user: UserEntity,
    @Args('giftUser') args: PayInput,
  ): Promise<ItemUserModel> {
    const item = await this.userService.gift(user, args);
    return item;
  }

  // Поля
  @ResolveField(() => [OrgModel], { name: 'orgs' })
  async orgs(@Parent() user: UserModel): Promise<OrgModel[]> {
    const { id } = user;
    return (await this.orgService.findMany({ uId: id, limit: 2 })).items;
  }

  @ResolveField(() => [SaleModel], { name: 'sales' })
  async sales(@Parent() user: UserModel): Promise<SaleModel[]> {
    const { id } = user;
    return (await this.cartService.findAllSales({ userId: id, limit: 2 })).items;
  }

  @ResolveField(() => CountryModel, { name: 'countr' })
  async countr(@Parent() user: UserModel): Promise<CountryModel> {
    const { id } = user;
    try {
      return (await this.countryService.findOne({ uId: id })).item;
    } catch (e) {
      return null;
    }
  }

  @ResolveField(() => [ArticleModel], { name: 'articles' })
  async articles(@Parent() user: UserModel): Promise<ArticleModel[]> {
    const { id } = user;
    return (await this.articleService.getArticles({ userId: id, limit: 2 })).items;
  }
}
