import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllOrg } from 'src/org/arg/findAll';
import { CountryService } from 'src/country/country.service';
import { PayInput } from 'src/common/others.model';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { FindConditions, Repository } from 'typeorm';
import { CreateInputOrg, EditInputOrg } from './arg/create';
import { FindOneOrg } from './arg/findOne';
import { OrgEntity } from './org.entity';
import { pubEvent } from 'src/notification/PubSub';
import { getImageUrl } from 'src/common/getImageUrl';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(OrgEntity)
    private orgRepository: Repository<OrgEntity>,
    private countryService: CountryService,
    private usersService: UserService,
    private imagesService: ImagesService,
  ) {}

  async save(orgs: OrgEntity[]) {
    return this.orgRepository.save(orgs);
  }

  async create(user: UserEntity, data: CreateInputOrg) {
    const Org = new OrgEntity();
    const { item: Country } = await this.countryService.findOne(
      { id: data.cId },
      ['user'],
    );
    if (Country) {
      if (Country.onlyGov && Country.user !== user)
        throw new BadRequestException(
          'У данного государства стоит знак "Только гос-венные организации"',
        );
      Org.countr = Country;
    }
    Org.user = user;
    if (data.balance && user.levelAccess > 2) Org.balance = data.balance;
    Org.name = data.title;
    Org.desc = data.text;
    Org.img = await this.imagesService.getById(data.imgId);
    if (data.isPublished && user.levelAccess > 1)
      Org.isPublished = data.isPublished;
    await this.orgRepository.save(Org);
    return { item: Org };
  }

  async findOne(
    data: FindOneOrg,
    relations?: string[],
    isPublished: boolean | 'none' = true,
  ) {
    let where: FindConditions<OrgEntity>;
    if (data.id) where = { ...where, id: data.id };
    if (data.pId) where = { ...where, products: [{ id: data.pId }] };
    if (isPublished !== 'none') where = { ...where, isPublished };
    const item = await this.orgRepository.findOne({
      where,
      relations,
    });
    if (!item) throw new NotFoundException('Организация не найдена');
    return { item };
  }

  async findMany(
    { limit, page, ...data }: FindAllOrg,
    relations?: string[],
    isPublished: boolean | 'none' = true,
  ) {
    let where: FindConditions<OrgEntity>;
    if (data.uId) where = { ...where, user: { id: data.uId } };
    if (data.cId) where = { ...where, countr: { id: data.cId } };
    if (isPublished !== 'none') where = { ...where, isPublished };
    const [items, summ] = await this.orgRepository.findAndCount({
      where,
      relations,
      skip: (page - 1) * limit,
      take: page * limit,
    });
    return { items, info: { summ, page, limit } };
  }

  async update(user: UserEntity, data: EditInputOrg) {
    const { item: Org } = await this.findOne({ id: data.id }, ['user'], 'none');
    const { item: Country } = await this.countryService.findOne(
      { id: data.cId },
      ['user'],
    );
    if (user.levelAccess < 2 && Org.user !== user)
      throw new BadRequestException('Неверный пользователь');
    if (Country) {
      if (Country.onlyGov && Country.user !== user)
        throw new BadRequestException(
          'У данного государства стоит знак "Только гос-венные организации"',
        );
      Org.countr = Country;
    }
    if (data.balance && user.levelAccess > 2) Org.balance = data.balance;
    Org.name = data.title;
    Org.desc = data.text;
    Org.img = await this.imagesService.getById(data.imgId);
    if (data.isPublished && user.levelAccess > 1)
      Org.isPublished = data.isPublished;
    await this.orgRepository.save(Org);
    return { item: Org };
  }

  async delete(user: UserEntity, id: number) {
    const { item: Org } = await this.findOne({ id }, ['user']);
    if (user.levelAccess < 2 && Org.user !== user)
      throw new BadRequestException('Неверный пользователь');
    await this.orgRepository.remove([Org]);
    return { isOk: true };
  }

  async pay(user: UserEntity, data: PayInput) {
    const { item: Org } = await this.findOne({ id: data.id });
    user.balance -= data.summ;
    Org.balance += data.summ;
    if (user !== Org.user)
      await pubEvent({
        forId: Org.user.id,
        isCool: true,
        text: `Вашу организацию (${Org.name}) спонсировал ${
          user.nick ? user.nick : user.username
        }.`,
        title: 'Организации | Спонсорство',
        typ: 'pay',
        img: getImageUrl(user.img),
      });
    await this.orgRepository.save(Org);
    await this.usersService.save([user]);
    return { item: Org };
  }
  async unpay(user: UserEntity, data: PayInput) {
    const { item: Org } = await this.findOne({ id: data.id }, ['user']);
    if (user.levelAccess < 3 && Org.user !== user)
      throw new BadRequestException('Неверный пользователь');
    user.balance -= data.summ;
    Org.balance += data.summ;
    await this.orgRepository.save(Org);
    await this.usersService.save([user]);
    return { item: Org };
  }
  async gift(data: PayInput) {
    const { item: Org } = await this.findOne({ id: data.id }, ['user']);
    Org.balance += data.summ;
    await this.orgRepository.save(Org);
    await pubEvent({
      forId: Org.user.id,
      isCool: true,
      text: `Ваша организация (${Org.name}) обрадовала Администрацию НБМ! Поэтому вы получаете +${data.summ}!`,
      title: 'Организации | Спонсорство',
      typ: 'pay',
      img: getImageUrl(Org.img),
    });
    return { item: Org };
  }
  async penalty(data: PayInput) {
    const { item: Org } = await this.findOne({ id: data.id }, ['user']);
    Org.balance -= data.summ;
    await pubEvent({
      forId: Org.user.id,
      isCool: false,
      text: `Ваша организация (${Org.name}) огорчила Администрацию НБМ! Поэтому вы получаете пизды и -${data.summ}!`,
      title: 'Организации | Спонсорство',
      typ: 'pay',
      img: getImageUrl(Org.img),
    });
    await this.orgRepository.save(Org);
    return { item: Org };
  }
  async accept(user: UserEntity, data: { id: number }) {
    const { item: Country } = await this.findOne(
      { id: data.id },
      ['user'],
      false,
    );
    await pubEvent({
      forId: Country.user.id,
      isCool: true,
      text: `Ваша заявка на организацию ${Country.name} принята!`,
      title: 'Заявки на организации | Принято',
      typ: 'accepted',
      img: getImageUrl(user.img),
    });
    Country.isPublished = true;
    await this.orgRepository.save(Country);
    return { isOk: true };
  }
  async decline(user: UserEntity, data: { id: number }) {
    const { item: Country } = await this.findOne(
      { id: data.id },
      ['user'],
      false,
    );
    await pubEvent({
      forId: Country.user.id,
      isCool: false,
      text: `Ваша заявка на организацию ${Country.name} отклонена!`,
      title: 'Заявки на организации | Отклонено',
      typ: 'accepted',
      img: getImageUrl(Country.img),
    });
    await this.orgRepository.remove(Country);
    return { isOk: true };
  }
}
