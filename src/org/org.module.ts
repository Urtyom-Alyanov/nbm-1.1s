import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from 'src/country/country.module';
import { ImagesModule } from 'src/images/images.module';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { OrgEntity } from './org.entity';
import { OrgResolver } from './org.resolver';
import { OrgService } from './org.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrgEntity]),
    forwardRef(() => CountryModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    ImagesModule,
  ],
  providers: [OrgResolver, OrgService],
  exports: [OrgService],
})
export class OrgModule {}
