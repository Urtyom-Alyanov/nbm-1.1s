import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { StatusModel } from "src/others.model";
import { ForAuth } from "src/user/auth.guard";
import { CurUser } from "src/user/curuser.dec";
import { UserEntity } from "src/user/user.entity";
import { UserModel } from "src/user/user.model";
import { UserService } from "src/user/user.service";
import { ArticleEntity } from "./article.entity";
import { ArticleModel, ItemArticleModel, ManyArticleModel } from "./article.model";
import { ArticleService } from "./article.service";
import { CreateInputArticle, EditInputArticle } from "./dto/arg/create";
import { FindAllArticlesArg } from "./dto/arg/findAll";
import { FindOneArgs } from "./dto/arg/findOne";

@Resolver(() => ArticleModel)
export class ArticleResolver {
    // constructor(
    //     @InjectRepository()
    //     private articleRepository: Repository<ArticleEntity>
    // ) {};
    constructor(
        private articleService: ArticleService,
        private userService: UserService
    ) {};
    // Запросы
    @Query(() => ManyArticleModel)
    async getManyArticle(@Args() args: FindAllArticlesArg): Promise<ManyArticleModel> {
        return await this.articleService.getArticles(args);
    };

    @Query(() => ItemArticleModel)
    async getOneArticle(@Args() args: FindOneArgs): Promise<ItemArticleModel> {
        return await this.articleService.getArticle(args);
    }

    @ForAuth(2)
    @Query(() => ManyArticleModel)
    async findNotAcceptedArticles(
        @Args() args: FindAllArticlesArg
    ): Promise<ManyArticleModel> {
        return await this.articleService.getArticles(args, false);
    };

    // Мутации
    @Mutation(() => ItemArticleModel)
    @ForAuth()
    async createArticle(
        @CurUser() user: UserEntity,
        @Args("CreateInputArticle") args: CreateInputArticle
    ): Promise<ItemArticleModel> {
        return await this.articleService.create(user, args);
    }

    @Mutation(() => StatusModel)
    @ForAuth()
    async deleteArticle(
        @CurUser() user: UserEntity,
        @Args("id") id: number
    ): Promise<StatusModel> {
        return await this.articleService.delete(user, id);
    }

    @Mutation(() => ItemArticleModel)
    @ForAuth()
    async editArticle(
        @CurUser() user: UserEntity,
        @Args("EditInputArticle") args: EditInputArticle
    ): Promise<ItemArticleModel> {
        return await this.articleService.edit(user, args);
    }

    @ForAuth(2)
    @Mutation(() => StatusModel)
    async acceptArticle(
        @CurUser() user: UserEntity,
        @Args("id") id: number
    ): Promise<StatusModel> {
        return await this.articleService.accept(user, id);
    };

    @ForAuth(2)
    @Mutation(() => StatusModel)
    async declineArticle(
        @CurUser() user: UserEntity,
        @Args("id") id: number
    ): Promise<StatusModel> {
        return await this.articleService.decline(user, id);
    };

    // Поля
    @ResolveField()
    async author(
        @Parent() article: ArticleEntity
    ): Promise<UserModel> {
        return (await this.userService.findOne({ articleId: article.id })).item;
    }
};