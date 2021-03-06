import { forwardRef, Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryResolver } from './country.resolver';
import { CountryEntity } from './country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgModule } from 'src/org/org.module';
import { UserModule } from 'src/user/user.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity]),
    forwardRef(() => OrgModule),
    forwardRef(() => UserModule),
    ImagesModule,
  ],
  providers: [CountryResolver, CountryService],
  exports: [CountryService],
})
export class CountryModule {}
