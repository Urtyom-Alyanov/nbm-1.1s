import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { OrgModule } from 'src/org/org.module';
import { CountryModule } from 'src/country/country.module';
import { CartModule } from 'src/product/cart.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => CountryModule),
    forwardRef(() => CartModule),
    forwardRef(() => OrgModule),
    ImagesModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
