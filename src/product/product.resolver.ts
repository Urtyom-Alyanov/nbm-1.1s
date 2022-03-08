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
import { StatusModel } from 'src/common/others.model';
import { ForAuth } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { CartService } from './cart.service';
import { CatService } from './cat.service';
import { CreateInputProduct, EditInputProduct } from './dto/create';
import { FindManyProduct } from './dto/getAllProduct';
import { FindOneProduct } from './dto/getOneProduct';
import { CatModel } from './models/cat.model';
import {
  ItemProductModel,
  ManyProductModel,
  ProductModel,
  SaleModel,
} from './models/product.model';
import { ProductService } from './product.service';
import { CurUser } from 'src/auth/curuser.dec';

@Resolver(() => ProductModel)
export class ProductResolver {
  constructor(
    private productService: ProductService,
    private catService: CatService,
    private cartService: CartService,
    private orgService: OrgService,
  ) {}

  // Запросы
  @Query(() => ManyProductModel)
  async findAllProduct(
    @Args() args: FindManyProduct,
  ): Promise<ManyProductModel> {
    return this.productService.getMany(args);
  }

  @Query(() => ManyProductModel)
  @ForAuth(2)
  async findNotAcceptedProduct(
    @Args() args: FindManyProduct,
  ): Promise<ManyProductModel> {
    return this.productService.getMany(args, false);
  }

  @Query(() => ItemProductModel)
  async findOneProduct(
    @Args() args: FindOneProduct,
  ): Promise<ItemProductModel> {
    return this.productService.getOne(args);
  }

  // Мутации
  @ForAuth(2)
  @Mutation(() => StatusModel)
  async acceptProduct(
    @Args('id') id: number,
    @CurUser() user: UserEntity,
  ): Promise<StatusModel> {
    return this.productService.accept({ id, summ: 1 });
  }

  @ForAuth(2)
  @Mutation(() => StatusModel)
  async declineProduct(
    @Args('id') id: number,
    @CurUser() user: UserEntity,
  ): Promise<StatusModel> {
    return this.productService.decline({ id, summ: 1 });
  }

  @ForAuth()
  @Mutation(() => ItemProductModel)
  async createProduct(
    @Args('createProductArgs') args: CreateInputProduct,
    @CurUser() user: UserEntity,
  ): Promise<ItemProductModel> {
    return this.productService.create(user, args);
  }

  @ForAuth()
  @Mutation(() => StatusModel)
  async deleteProduct(
    @Args('id') id: number,
    @CurUser() user: UserEntity,
  ): Promise<StatusModel> {
    return this.productService.delete(user, id);
  }

  @ForAuth()
  @Mutation(() => ItemProductModel)
  async editProduct(
    @Args('editProductArgs') args: EditInputProduct,
    @CurUser() user: UserEntity,
  ): Promise<ItemProductModel> {
    return this.productService.update(user, args);
  }

  // Поля
  @ResolveField(() => CatModel)
  async category(@Parent() product: ProductModel): Promise<CatModel> {
    return (await this.catService.getOne({ pId: product.id })).item;
  }

  @ResolveField(() => [SaleModel])
  async sales(@Parent() product: ProductModel): Promise<SaleModel[]> {
    return (
      await this.cartService.findAllSales({
        productId: product.id,
        page: 1,
        limit: 3,
      })
    ).items;
  }

  @ResolveField(() => OrgModel)
  async org(@Parent() product: ProductModel): Promise<OrgModel> {
    return (await this.orgService.findOne({ pId: product.id })).item;
  }
}
// Фюр унд фюр! Дихте разочерсте Фаллеланд Социализмус Партей! Комрадест нефритиус балка Фаллеланд Артиём Клочиков унриф ин дих ерстефинсте Леу
