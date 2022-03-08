import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ImagesEntity } from './images.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImagesEntity)
    private imagesRepo: Repository<ImagesEntity>,
  ) {}

  async upload(user: UserEntity, dataBuffer: Buffer) {
    const newFile = new ImagesEntity();
    newFile.file = dataBuffer;
    newFile.owner = user;
    return await this.imagesRepo.save(newFile);
  }

  async getById(id: number) {
    const file = await this.imagesRepo.findOne(id);
    if (!file) throw new NotFoundException('Файл не найден');
    return file;
  }

  async delete(user: UserEntity, id: number) {
    const file = await this.getById(id);
    if (file.owner !== user) throw new ForbiddenException('Не ваша картинка');
    return await this.imagesRepo.delete(file);
  }

  async update(user: UserEntity, dataBuffer: Buffer, id: number) {
    const file = await this.getById(id);
    if (file.owner !== user) throw new ForbiddenException('Не ваша картинка');
    file.file = dataBuffer;
    return await this.imagesRepo.save(file);
  }
}
