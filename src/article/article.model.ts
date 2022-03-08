import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ManyModelClass } from 'src/others.model';
import { UserModel } from 'src/user/user.model';

@ObjectType()
export class ArticleModel {
    @Field(type => Int)
    id: number;

    @Field(() => String, { nullable: false })
    name: string;

    @Field(() => String, { nullable: true })
    img?: string;

    @Field(() => String, { nullable: false })
    desc: string;

    @Field(() => UserModel)
    author: UserModel
    @Field() updatedAt: Date;
    @Field() createdAt: Date;
}

@ObjectType()
export class ManyArticleModel extends ManyModelClass {
    @Field(() => [ArticleModel]) items: ArticleModel[];
};
@ObjectType()
export class ItemArticleModel {
    @Field(() => ArticleModel) item: ArticleModel;
};