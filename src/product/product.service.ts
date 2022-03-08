import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pubEvent } from 'src/notification/PubSub';
import { ImagesService } from 'src/images/images.service';
import { OrgService } from 'src/org/org.service';
import { PayInput } from 'src/common/others.model';
import { UserEntity } from 'src/user/user.entity';
import { FindConditions, Repository } from 'typeorm';
import { CatService } from './cat.service';
import { CreateInputProduct, EditInputProduct } from './dto/create';
import { FindManyProduct } from './dto/getAllProduct';
import { FindOneProduct } from './dto/getOneProduct';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private categoryService: CatService,
    private orgService: OrgService,
    private imagesService: ImagesService,
  ) {}

  async getOne(
    data: FindOneProduct,
    isPublished: boolean | 'none' = true,
    relations?: string[],
  ) {
    let where: FindConditions<ProductEntity>;
    if (data.id) where = { ...where, id: data.id };
    if (data.sId) where = { ...where, sales: [{ id: data.sId }] };
    if (isPublished !== 'none') where = { ...where, isPublished };
    const item = await this.productRepository.findOne({
      where,
      relations,
      loadRelationIds: true,
    });
    if (!item) throw new NotFoundException('Продукт не найден');
    return { item };
  }

  async getMany(
    { limit, page, ...data }: FindManyProduct,
    isPublished: boolean | 'none' = true,
    relations?: string[],
  ) {
    let where: FindConditions<ProductEntity>;
    if (data.catId) where = { ...where, category: { id: data.catId } };
    if (data.oId) where = { ...where, org: { id: data.oId } };
    if (isPublished !== 'none') where = { ...where, isPublished };
    const [items, summ] = await this.productRepository.findAndCount({
      where,
      relations,
      take: limit * page,
      skip: limit * (page - 1),
    });
    return { items, info: { summ, page, limit } };
  }

  async create(user: UserEntity, data: CreateInputProduct) {
    const { item: Org } = await this.orgService.findOne({ id: data.oId }, [
      'user',
    ]);
    if (user !== Org.user && user.levelAccess < 3)
      throw new BadRequestException('Неверный пользователь');
    let Product = new ProductEntity();
    Product.org = Org;
    if (data.productType === 1) {
      Product.selfSale = data.selfSale;
      Product.count = data.count;
    }
    Product.productType = data.productType;
    Product.name = data.name;
    Product.desc = data.text;
    Product.sale = data.sale;
    Product.img = await this.imagesService.getById(data.imgId);
    if (user.levelAccess > 1) Product.isPublished = data.isPublished || false;
    Product.category = data.catId
      ? (await this.categoryService.getOne({ id: data.catId })).item
      : null;
    Product = await this.productRepository.save(Product);
    return { item: Product };
  }
  async update(user: UserEntity, data: EditInputProduct) {
    let Product = (
      await this.getOne({ id: data.id }, true, ['org', 'org.user'])
    ).item;
    if (user !== Product.org.user && user.levelAccess < 3)
      throw new BadRequestException('Неверный пользователь');
    Product.name = data.name;
    Product.desc = data.text;
    Product.sale = data.sale;
    Product.img = await this.imagesService.getById(data.imgId);
    if (user.levelAccess > 1) Product.isPublished = data.isPublished || false;
    Product.category = data.catId
      ? (await this.categoryService.getOne({ id: data.catId })).item
      : null;
    Product = await this.productRepository.save(Product);
    return { item: Product };
  }
  async delete(user: UserEntity, id: number) {
    const { item: Product } = await this.getOne({ id }, false, [
      'org',
      'org.user',
    ]);
    if (user !== Product.org.user && user.levelAccess < 3)
      throw new BadRequestException('Неверный пользователь');
    await this.productRepository.remove(Product);
    return { isOk: true };
  }
  async addItems(user: UserEntity, data: PayInput) {
    const { item: Product } = await this.getOne({ id: data.id }, false, [
      'org',
      'org.user',
    ]);
    if (user !== Product.org.user && user.levelAccess < 3)
      throw new BadRequestException('Неверный пользователь');
    Product.count += data.summ;
    Product.org.balance -= Product.selfSale * data.summ * 1.05;
    await this.productRepository.save(Product);
    await this.orgService.save([Product.org]);
    return { item: Product };
  }
  async accept(data: PayInput) {
    const { item: Product } = await this.getOne({ id: data.id }, false, [
      'org',
      'org.user',
    ]);
    Product.isPublished = true;
    await pubEvent({
      forId: Product.org.user.id,
      isCool: true,
      text: `Ваша заявка на продукт ${Product.name} принята! Теперь её могут покупать разные товарищи!`,
      title: 'Заявки на продукты | Принято',
      typ: 'accepted',
      img: `/api/images/${Product.img}`,
    });
    await this.productRepository.save(Product);
    return { isOk: true };
  }
  async decline(data: PayInput) {
    const { item: Product } = await this.getOne({ id: data.id }, false, [
      'user',
    ]);
    await pubEvent({
      forId: Product.org.user.id,
      isCool: false,
      text: `Ваша заявка на продукт ${Product.name} отклонена!`,
      title: 'Заявки на продукты | Отклонено',
      typ: 'accepted',
      img: `/api/images/${Product.img}`,
    });
    await this.productRepository.remove(Product);
    return { isOk: true };
  }
}
