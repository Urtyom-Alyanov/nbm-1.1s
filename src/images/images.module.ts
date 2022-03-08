import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesEntity } from './images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImagesEntity]),
    MulterModule.register({
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  ],
  providers: [ImagesService],
  controllers: [ImagesController],
  exports: [ImagesService],
})
export class ImagesModule {}
