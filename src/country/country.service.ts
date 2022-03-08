import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pubEvent } from 'src/app.service';
import { PayInput } from 'src/others.model';
import { FindAllArgs as FindAll } from 'src/user/dto/findAll.dto';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { CreateInputCountry, EditInputCountry } from './arg/create';
import { FindOneCountry } from './arg/findOne';
import { CountryEntity } from './country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    @Inject(forwardRef(() => UserService))
    private usersService: UserService,
  ) {};
  
  async findAll({limit, page}: FindAll, relations?: string[], isPublished: boolean | "none" = true) {
    let where: FindConditions<CountryEntity>;
    if(isPublished !== "none") where = {...where, isPublished}
    const [items, summ] = await this.countryRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit * page,
      relations, where
    });
    return {
      items,
      info: {
        limit,
        page,
        summ
      }
    }
  };
  async findOne({oId, uId, id}: FindOneCountry, relations?: string[], isPublished: boolean | "none" = true) {
    let where: FindConditions<CountryEntity>;
    if(isPublished !== "none") where = {...where, isPublished}
    if(oId) where = {...where, orgs: [{ id: oId }]};
    if(uId) where = {...where, user: { id: uId }};
    if(id) where = {...where, id};
    const item = await this.countryRepository.findOne({
      where, relations
    })
    if(!item) throw new NotFoundException("Гос-во не найдено")
    return { item };
  };
  async penality(data: PayInput) {
    const { item: Country } = await this.findOne({ id: data.id }, ["user"]);
    Country.balance -= data.summ;
    await this.countryRepository.save(Country);
    await pubEvent({
      forId: Country.user.id,
      isCool: false,
      text: `Ваше гос-во (${Country.name}) огорчило Администрацию НБМ! Поэтому вы получаете пизды и -${data.summ}!`,
      title: "Гос-ва | Спонсорство",
      typ: "pay",
      img: Country.img
    });
    return { item: Country }
  };
  async gift(data: PayInput) {
    const { item: Country } = await this.findOne({ id: data.id }, ["user"]);
    Country.balance += data.summ;
    await pubEvent({
      forId: Country.user.id,
      isCool: true,
      text: `Ваше гос-во (${Country.name}) обрадовало Администрацию НБМ! Поэтому вы получаете +${data.summ}!`,
      title: "Гос-ва | Спонсорство",
      typ: "pay",
      img: Country.img
    });
    await this.countryRepository.save(Country);
    return { item: Country }
  };
  async pay(user: UserEntity, data: PayInput) {
    const { item: Country } = await this.findOne({ id: data.id }, ["user"]);
    user.balance -= data.summ;
    Country.balance += data.summ;
    if(user == Country.user) await pubEvent({
      forId: Country.user.id,
      isCool: true,
      text: `Ваше гос-во (${Country.name}) спонсировал ${user.nick ? user.nick : user.username}.`,
      title: "Гос-ва | Спонсорство",
      typ: "pay",
      img: user.img
    });
    await this.countryRepository.save(Country);
    await this.usersService.save([user]);
    return { item: Country }
  };
  async unpay(user: UserEntity, data: PayInput) {
    const { item: Country } = await this.findOne({ id: data.id }, ["user"]);
    if(user.levelAccess < 3 && Country.user !== user) throw new HttpException("Неверный пользователь", HttpStatus.BAD_REQUEST);
    user.balance += data.summ;
    Country.balance -= data.summ;
    await this.countryRepository.save(Country);
    await this.usersService.save([user]);
    return { item: Country }
  };
  async create(user: UserEntity, data: CreateInputCountry) {
    const Country = new CountryEntity();
    try {
      await this.findOne({ uId: user.id }, [], "none")
      throw new BadRequestException("У вас уже есть страна.");
    } catch(e) {};
    Country.user = user;
    Country.desc = data.text;
    Country.name = data.title;
    Country.img = data.img;
    if(user.levelAccess > 1) Country.isPublished = data.isPublished;
    if(user.levelAccess > 2) Country.balance = data.balance;
    return { item: Country };
  };
  async delete(user: UserEntity, data: { id: number }) {
    const { item: Country } = await this.findOne({ id: data.id }, ["user"]);
    if(user.levelAccess < 2 && Country.user !== user) throw new HttpException("Неверный пользователь", HttpStatus.BAD_REQUEST);
    await this.countryRepository.remove(Country);
    return { isOk: true }
  };
  async edit(user: UserEntity, data: EditInputCountry) {
    const { item: Country } = await this.findOne({ id: data.id }, ["user"]);
    if(user.levelAccess < 2 && Country.user !== user) throw new HttpException("Неверный пользователь", HttpStatus.BAD_REQUEST);
    Country.desc = data.text;
    Country.name = data.title;
    Country.img = data.img;
    if(user.levelAccess > 1) Country.isPublished = data.isPublished;
    if(user.levelAccess > 2) Country.balance = data.balance;
    return { item: Country }
  };
  async accept(user: UserEntity, data: { id: number }) {
    const { item: Country } = await this.findOne({ id: data.id }, ["user"], false);
    await pubEvent({
      forId: Country.user.id,
      isCool: true,
      text: `Ваша заявка на гос-во ${Country.name} принята!`,
      title: "Заявки на гос-ва | Принято",
      typ: "accepted",
      img: Country.img
    });
    Country.isPublished = true;
    await this.countryRepository.save(Country);
    return { isOk: true }
  };
  async decline(user: UserEntity, data: { id: number }) {
    const { item: Country } = await this.findOne({ id: data.id }, ["user"], false);
    await pubEvent({
      forId: Country.user.id,
      isCool: false,
      text: `Ваша заявка на гос-во ${Country.name} отклонено!`,
      title: "Заявки на гос-ва | Отклонено",
      typ: "accepted",
      img: Country.img
    });
    await this.countryRepository.remove(Country);
    return { isOk: true }
  };
}
