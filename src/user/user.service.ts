import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { compare, hash } from 'bcrypt';
import { FindAllArgs as FindAll } from './dto/findAll.dto';
import { CountryService } from 'src/country/country.service';
import { pubEvent } from 'src/notification/PubSub';
import { DualUserModel, ItemUserModel, ManyUserModel } from './user.model';
import { ImagesService } from 'src/images/images.service';
import { FindOneArgs } from './dto/findOne.dto';
import { IResponseModel } from 'src/common/ManyModel';
import { getImageUrl } from 'src/common/getImageUrl';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => CountryService))
    private countryService: CountryService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private imagesService: ImagesService,
  ) {}
  async findAll({ limit, page }: FindAll): Promise<ManyUserModel> {
    const [items, summ] = await this.usersRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit * page,
      loadRelationIds: true,
    });
    return { items, info: { limit, summ, page } };
  }

  async findOne({
    countryId,
    id,
    orgId,
    vkId,
    username,
    cartId,
  }: FindOneArgs): Promise<IResponseModel<UserEntity>> {
    let where: FindConditions<UserEntity> = {};
    if (orgId) where = { ...where, orgs: [{ id: orgId }] };
    if (cartId) where = { ...where, sales: [{ id: cartId }] };
    if (id) where = { ...where, id };
    if (countryId)
      where = {
        ...where,
        id: (await this.countryService.findOne({ id: countryId }, ['user']))
          .item.user.id,
      };
    if (vkId) where = { ...where, vkId };
    if (username) where = { ...where, username };
    const item = await this.usersRepository.findOne({
      where,
    });
    if (!item)
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    return { item };
  }

  async deleteUser(
    user: UserEntity,
    { username, password }: { password: string; username: string },
  ): Promise<boolean> {
    if (user.username !== username || (await compare(password, user.password)))
      throw new HttpException(
        'Пароль и/или логин не верны',
        HttpStatus.BAD_REQUEST,
      );
    await this.usersRepository.remove(user);
    return true;
  }

  async levelControl(
    user: UserEntity,
    { to, id }: { to: 'down' | 'up'; id: number },
  ): Promise<ItemUserModel> {
    const { item } = await this.findOne({ id });
    switch (to) {
      case 'down':
        if (item.levelAccess - 1 < 1)
          throw new HttpException(
            'Ниже 1 уровня понижать пользователя нельзя',
            HttpStatus.BAD_REQUEST,
          );
        item.levelAccess -= 1;
        break;

      default:
        if (item.levelAccess + 1 >= user.levelAccess)
          throw new HttpException(
            `Выше вашего уровня повышать нельзя пользователя нельзя, для вас максиум - ${
              user.levelAccess - 1
            }`,
            HttpStatus.BAD_REQUEST,
          );
        item.levelAccess += 1;
        break;
    }
    await pubEvent({
      title: `${to === 'down' ? 'Понижение' : 'Повышение'} уровня!`,
      forId: item.id,
      text: `
                ${
                  to === 'down'
                    ? 'Ну и ну! Вы злоупотребляли возможностями администрации. Поэтому -1 уровень доступа'
                    : 'Вы обрадовали администрацию НБМ! +1 уровень доступа - тебе'
                }. Ваш текущий уровень - ${item.levelAccess}.
            `,
      isCool: to === 'up',
      typ: 'level',
    });
    await this.usersRepository.save(item);
    return { item };
  }

  async pay(
    user: UserEntity,
    { summ, id }: { summ: number; id: number },
  ): Promise<DualUserModel> {
    const { item } = await this.findOne({ id });
    if (user.balance < summ)
      throw new HttpException(
        `Для перевода не хватает средств (${
          user.balance - summ
        }). Текущий баланс - ${user.balance}`,
        HttpStatus.BAD_REQUEST,
      );
    user.balance -= summ;
    item.balance += summ;
    await pubEvent({
      title: `Пополнение!`,
      forId: item.id,
      text: `Здравствуйте, вам пополнение от ${
        user.nick ? user.nick : user.username
      }! Размер пополнения ${summ}!`,
      isCool: true,
      typ: 'pay',
      img: getImageUrl(user.img),
    });
    await this.usersRepository.save([item, user]);
    return { user1: user, user2: item };
  }

  async update(
    user: UserEntity,
    { desc, imgId, nick }: { desc?: string; imgId?: number; nick?: string },
  ): Promise<ItemUserModel> {
    if (imgId) user.img = await this.imagesService.getById(imgId);
    user.nick = nick;
    user.desc = desc;
    await this.usersRepository.save(user);
    return { item: user };
  }

  async updatePassword(
    user: UserEntity,
    {
      passwordOld,
      passwordNew1,
    }: { passwordOld: string; passwordNew1: string },
  ): Promise<ItemUserModel> {
    if (!(await compare(passwordOld, user.password)))
      throw new HttpException('Неверный старый пароль', HttpStatus.BAD_REQUEST);
    user.password = await hash(passwordNew1, 10);
    await this.usersRepository.save(user);
    return { item: user };
  }

  async updateUsername(
    user: UserEntity,
    { username, password }: { username: string; password: string },
  ): Promise<ItemUserModel> {
    if (!(await compare(password, user.password)))
      throw new HttpException('Неверный старый пароль', HttpStatus.BAD_REQUEST);
    user.username = username;
    await this.usersRepository.save(user);
    return { item: user };
  }

  async gift(
    user: UserEntity,
    { summ, id }: { summ: number; id: number },
  ): Promise<ItemUserModel> {
    const { item } = await this.findOne({ id });
    item.balance += summ;
    await pubEvent({
      title: `Награждение!`,
      forId: item.id,
      text: `Здраствуйте, вы обрадовали Администрацию НБМ, поэтому вы получаете ${summ}!`,
      isCool: true,
      typ: 'pay',
    });
    await this.usersRepository.save(item);
    return { item };
  }

  async penalty(
    user: UserEntity,
    { summ, id }: { summ: number; id: number },
  ): Promise<ItemUserModel> {
    const { item } = await this.findOne({ id });
    item.balance -= summ;
    await this.usersRepository.save(item);
    await pubEvent({
      title: `Тоби пизда!`,
      forId: item.id,
      text: `Здраствуйте, вы разозлили Администрацию НБМ, поэтому вы получаете пизды и -${summ}!`,
      isCool: false,
      typ: 'pay',
    });
    return { item };
  }

  async save(user: UserEntity[]) {
    return await this.usersRepository.save(user);
  }
}
