import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from 'src/images/images.module';
import { OrgModule } from 'src/org/org.module';
import { UserModule } from 'src/user/user.module';
import { CartModule } from './cart.module';
import { CatModule } from './cat.module';
import { ProductEntity } from './entities/product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => OrgModule),
    forwardRef(() => CatModule),
    forwardRef(() => CartModule),
    ImagesModule,
  ],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
