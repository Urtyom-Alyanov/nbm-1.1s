import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';
import { CatEntity } from './entities/cat.entity';
import { ProductModule } from './product.module';

@Module({
    imports: [TypeOrmModule.forFeature([CatEntity]), forwardRef(() => UserModule), forwardRef(() => ProductModule)],
    providers: [CatResolver, CatService],
    exports: [CatService]
})
export class CatModule {}
