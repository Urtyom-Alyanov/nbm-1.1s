import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pubEvent } from 'src/notification/PubSub';
import { OrgService } from 'src/org/org.service';
import { PayInput } from 'src/common/others.model';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { FindConditions, Repository } from 'typeorm';
import { FindOneCat } from './dto/category';
import { FindAllSales } from './dto/findAllSales';
import { CartEntity } from './entities/product.entity';
import { ProductService } from './product.service';

@Injectable()
export class CartService {
  constructor(
    private productService: ProductService,
    private orgService: OrgService,
    private userService: UserService,
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
  ) {}

  async findAllSales({ userId, productId, limit, page }: FindAllSales) {
    let where: FindConditions<CartEntity>;
    if (productId) where = { product: { id: productId } };
    if (userId) where = { user: { id: userId } };
    const [items, summ] = await this.cartRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit * page,
      where,
    });
    return { items, info: { limit, page, summ } };
  }

  async findOneSale({ id }: FindOneCat) {
    const item = await this.cartRepository.findOne(id);
    if (!item) throw new NotFoundException('Покупка не найдена');
    return { item };
  }

  async payProduct(user: UserEntity, data: PayInput) {
    const { item: Product } = await this.productService.getOne(
      { id: data.id },
      true,
      ['org', 'org.user'],
    );
    if (Product.productType && Product.count < data.summ)
      throw new BadRequestException(
        'На складе нет столько товаров, скольно вы хотите. Подождите закупки.',
      );
    user.balance -= data.summ * Product.sale * 1.05;
    Product.org.balance += data.summ * Product.sale;
    this.orgService.save([Product.org]);
    this.userService.save([user]);
    let sale = (
      await this.findAllSales({ userId: user.id, productId: data.id })
    ).items[0];
    if (!sale) {
      sale = new CartEntity();
      sale.items = data.summ;
      sale.product = Product;
      sale.user = user;
    } else {
      sale.items += data.summ;
    }
    await pubEvent({
      forId: Product.org.user.id,
      isCool: true,
      text: `Ваш продукт (${Product.name}, комп. ${Product.org.name}) купил ${
        user.nick ? user.nick : user.username
      }.`,
      title: 'Продукты | Покупки',
      typ: 'accepted',
      img: `/api/images/${Product.img}`,
    });
    return { item: sale };
  }
}
