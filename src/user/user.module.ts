import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ArticleModule } from 'src/article/article.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth.strategy';
import { OrgModule } from 'src/org/org.module';
import { CountryModule } from 'src/country/country.module';
import { CartModule } from 'src/product/cart.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({
        secret: "popaEremeia"
    }), forwardRef(() => ArticleModule), PassportModule, forwardRef(() => CountryModule), forwardRef(() => CartModule), forwardRef(() => OrgModule)],
    providers: [UserResolver, UserService, JwtStrategy],
    exports: [UserService]
})
export class UserModule {}
