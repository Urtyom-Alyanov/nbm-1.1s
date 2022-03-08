import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PayInput } from 'src/common/others.model';
import { ForAuth } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { UserModel } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CartService } from './cart.service';
import { FindOneCat } from './dto/category';
import { FindAllSales } from './dto/findAllSales';
import {
  ItemSaleModel,
  ManySaleModel,
  ProductModel,
  SaleModel,
} from './models/product.model';
import { ProductService } from './product.service';
import { CurUser } from 'src/auth/curuser.dec';

@Resolver(() => SaleModel)
export class SaleResolver {
  constructor(
    private saleService: CartService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  // Заросы
  @Query(() => ManySaleModel)
  async saleFindAll(@Args() data: FindAllSales): Promise<ManySaleModel> {
    return await this.saleService.findAllSales(data);
  }

  @Query(() => ItemSaleModel)
  async saleFindOne(@Args() data: FindOneCat): Promise<ItemSaleModel> {
    return await this.saleService.findOneSale(data);
  }

  // Мутации
  @Mutation(() => ItemSaleModel)
  @ForAuth()
  async productPay(
    @CurUser() user: UserEntity,
    @Args('payProduct') data: PayInput,
  ): Promise<ItemSaleModel> {
    return await this.saleService.payProduct(user, data);
  }

  // Поля
  @ResolveField(() => UserModel)
  async user(@Parent() sale: SaleModel): Promise<UserModel> {
    return (await this.userService.findOne({ cartId: sale.id })).item;
  }
  @ResolveField(() => ProductModel)
  async product(@Parent() sale: SaleModel): Promise<ProductModel> {
    return (await this.productService.getOne({ sId: sale.id })).item;
  }
}
