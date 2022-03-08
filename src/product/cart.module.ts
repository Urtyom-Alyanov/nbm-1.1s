import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgModule } from 'src/org/org.module';
import { UserModule } from 'src/user/user.module';
import { SaleResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { CartEntity } from './entities/product.entity';
import { ProductModule } from './product.module';

@Module({
    imports: [
        forwardRef(() => OrgModule),
        forwardRef(() => UserModule),
        forwardRef(() => ProductModule),
        TypeOrmModule.forFeature([CartEntity])
    ],
    providers: [SaleResolver, CartService],
    exports: [CartService]
})
export class CartModule {}
