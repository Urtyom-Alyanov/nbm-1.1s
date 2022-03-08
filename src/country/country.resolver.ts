import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { OrgModel } from 'src/org/org.model';
import { OrgService } from 'src/org/org.service';
import { PayInput, StatusModel } from 'src/common/others.model';
import { ForAuth } from 'src/auth/auth.guard';
import { FindAllArgs } from 'src/user/dto/args/findAll.arg';
import { UserEntity } from 'src/user/user.entity';
import { UserModel } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CreateInputCountry, EditInputCountry } from './arg/create';
import { FindOneCountry } from './arg/findOne';
import {
  CountryModel,
  ItemCountryModel,
  ManyCountryModel,
} from './country.model';
import { CountryService } from './country.service';
import { CurUser } from 'src/auth/curuser.dec';

@Resolver(() => CountryModel)
export class CountryResolver {
  constructor(
    private countryService: CountryService,
    private userService: UserService,
    private orgService: OrgService,
  ) {}
  // Запросы
  @Query(() => ManyCountryModel)
  async findAllCountry(@Args() data: FindAllArgs): Promise<ManyCountryModel> {
    return await this.countryService.findAll(data);
  }

  @Query(() => ManyCountryModel)
  @ForAuth(2)
  async findNotAcceptedCountry(
    @Args() data: FindAllArgs,
  ): Promise<ManyCountryModel> {
    return await this.countryService.findAll(data, undefined, false);
  }

  @Query(() => ItemCountryModel)
  async findCountry(@Args() data: FindOneCountry) {
    return await this.countryService.findOne(data);
  }

  // Мутации
  @ForAuth()
  @Mutation(() => ItemCountryModel)
  async createCountry(
    @CurUser() user: UserEntity,
    @Args('createCountryArgs') data: CreateInputCountry,
  ) {
    return this.countryService.create(user, data);
  }

  @Mutation(() => ItemCountryModel)
  @ForAuth()
  async editCountry(
    @CurUser() user: UserEntity,
    @Args('editCountryArgs') data: EditInputCountry,
  ) {
    return this.countryService.edit(user, data);
  }

  @Mutation(() => StatusModel)
  @ForAuth()
  async deleteCountry(@CurUser() user: UserEntity, @Args('id') id: number) {
    return this.countryService.delete(user, { id });
  }

  @Mutation(() => ItemCountryModel)
  @ForAuth()
  async payCountry(
    @CurUser() user: UserEntity,
    @Args('payCountryArgs') data: PayInput,
  ) {
    return this.countryService.pay(user, data);
  }

  @Mutation(() => ItemCountryModel)
  @ForAuth()
  async unpayCountry(
    @CurUser() user: UserEntity,
    @Args('unpayCountryArgs') data: PayInput,
  ) {
    return this.countryService.unpay(user, data);
  }

  @Mutation(() => ItemCountryModel)
  @ForAuth(3)
  async giftCountry(
    @CurUser() user: UserEntity,
    @Args('giftCountryArgs') data: PayInput,
  ) {
    return this.countryService.gift(data);
  }

  @Mutation(() => ItemCountryModel)
  @ForAuth(3)
  async penaltyCountry(
    @CurUser() user: UserEntity,
    @Args('penaltyCountryArgs') data: PayInput,
  ) {
    return this.countryService.penality(data);
  }

  @Mutation(() => StatusModel)
  @ForAuth(2)
  async acceptCountry(@CurUser() user: UserEntity, @Args('id') id: number) {
    return this.countryService.accept(user, { id });
  }

  @Mutation(() => StatusModel)
  @ForAuth(2)
  async declineCountry(@CurUser() user: UserEntity, @Args('id') id: number) {
    return this.countryService.decline(user, { id });
  }
  // Подписки

  // Поля
  @ResolveField(() => UserModel)
  async user(@Parent() country: CountryModel): Promise<UserModel> {
    console.log(country);
    return (await this.userService.findOne({ countryId: country.id })).item;
  }

  @ResolveField(() => [OrgModel])
  async orgs(@Parent() country: CountryModel): Promise<OrgModel[]> {
    console.log(country);
    return (await this.orgService.findMany({ cId: country.id })).items;
  }
}
