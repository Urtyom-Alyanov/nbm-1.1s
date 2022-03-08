import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ArticleEntity } from './article.entity';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity]), forwardRef(() => UserModule)],
    providers: [ArticleResolver, ArticleService],
    exports: [ArticleService]
})
export class ArticleModule {}
