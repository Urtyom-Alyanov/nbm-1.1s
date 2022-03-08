import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CountryModel } from 'src/country/country.model';
import { CountryService } from 'src/country/country.service';
import { PayInput, StatusModel } from 'src/common/others.model';
import { ProductModel } from 'src/product/models/product.model';
import { ProductService } from 'src/product/product.service';
import { ForAuth } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { UserModel } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CreateInputOrg, EditInputOrg } from './arg/create';
import { FindAllOrg } from './arg/findAll';
import { FindOneOrg } from './arg/findOne';
import { ItemOrgModel, ManyOrgModel, OrgModel } from './org.model';
import { OrgService } from './org.service';
import { CurUser } from 'src/auth/curuser.dec';

@Resolver(() => OrgModel)
export class OrgResolver {
  constructor(
    private orgService: OrgService,
    private productService: ProductService,
    private userService: UserService,
    private countryService: CountryService,
  ) {}

  // Запросы
  @Query(() => ManyOrgModel)
  async findAllOrg(@Args() data: FindAllOrg) {
    return this.orgService.findMany(data);
  }

  @Query(() => ManyOrgModel)
  @ForAuth(2)
  async findNotAcceptedOrg(@Args() data: FindAllOrg) {
    return this.orgService.findMany(data, [], false);
  }

  @Query(() => ItemOrgModel)
  async findOneOrg(@Args() data: FindOneOrg) {
    return this.orgService.findOne(data);
  }

  // Мутации
  @ForAuth()
  @Mutation(() => ItemOrgModel)
  async createOrg(
    @CurUser() user: UserEntity,
    @Args('createOrgArgs') data: CreateInputOrg,
  ) {
    return this.orgService.create(user, data);
  }

  @ForAuth()
  @Mutation(() => ItemOrgModel)
  async editOrg(
    @CurUser() user: UserEntity,
    @Args('editOrgArgs') data: EditInputOrg,
  ) {
    return this.orgService.update(user, data);
  }

  @ForAuth()
  @Mutation(() => StatusModel)
  async deleteOrg(@CurUser() user: UserEntity, @Args('id') id: number) {
    return this.orgService.delete(user, id);
  }

  @ForAuth()
  @Mutation(() => ItemOrgModel)
  async payOrg(
    @CurUser() user: UserEntity,
    @Args('payOrgArgs') data: PayInput,
  ) {
    return this.orgService.pay(user, data);
  }

  @ForAuth()
  @Mutation(() => ItemOrgModel)
  async unpayOrg(
    @CurUser() user: UserEntity,
    @Args('unpayOrgArgs') data: PayInput,
  ) {
    return this.orgService.unpay(user, data);
  }

  @ForAuth(3)
  @Mutation(() => ItemOrgModel)
  async giftOrg(@Args('giftOrgArgs') data: PayInput) {
    return this.orgService.gift(data);
  }

  @ForAuth(3)
  @Mutation(() => StatusModel)
  async penaltyOrg(@Args('penaltyOrgArgs') data: PayInput) {
    return this.orgService.penalty(data);
  }

  @ForAuth(2)
  @Mutation(() => StatusModel)
  async acceptOrg(@CurUser() user: UserEntity, @Args('id') id: number) {
    return this.orgService.accept(user, { id });
  }

  @ForAuth(2)
  @Mutation(() => StatusModel)
  async declineOrg(@CurUser() user: UserEntity, @Args('id') id: number) {
    return this.orgService.accept(user, { id });
  }

  // Поля
  @ResolveField(() => [ProductModel])
  async products(@Parent() org: OrgModel): Promise<ProductModel[]> {
    return (await this.productService.getMany({ oId: org.id })).items;
  }

  @ResolveField(() => CountryModel)
  async country(@Parent() org: OrgModel): Promise<CountryModel> {
    return (await this.countryService.findOne({ oId: org.id })).item;
  }

  @ResolveField(() => UserModel)
  async user(@Parent() org: OrgModel): Promise<UserModel> {
    return (await this.userService.findOne({ orgId: org.id })).item;
  }
}
