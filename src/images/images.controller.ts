import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  StreamableFile,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { ForAuth } from 'src/auth/auth.guard';
import { CurUser } from 'src/auth/curuser.dec';
import { UserEntity } from 'src/user/user.entity';
import { Readable } from 'stream';
import { ImagesService } from './images.service';

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  async getImage(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.imagesService.getById(id);
    const stream = Readable.from(file.file);
    response.set({
      'Content-Dispostion': 'inline;',
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }

  @Post()
  @ForAuth()
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurUser() user: UserEntity,
    @Res({ passthrough: true }) response: Response,
  ) {
    const image = await this.imagesService.upload(user, file.buffer);
    const stream = Readable.from(image.file);
    response.set({
      'Content-Dispostion': 'inline;',
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }

  @Put(':id')
  @ForAuth()
  async updateImage(
    @UploadedFile() file: Express.Multer.File,
    @CurUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const image = await this.imagesService.update(user, file.buffer, id);
    const stream = Readable.from(image.file);
    response.set({
      'Content-Dispostion': 'inline;',
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }

  @Delete(':id')
  @ForAuth()
  async deleteImage(
    @CurUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.deleteImage(user, id);
  }
}
