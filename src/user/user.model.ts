import { Field, ObjectType, Int } from "@nestjs/graphql";
import { ArticleModel } from "src/article/article.model";
import { CountryModel } from "src/country/country.model";
import { OrgModel } from "src/org/org.model";
import { ManyModelClass } from "src/others.model";
import { SaleModel } from "src/product/models/product.model";

@ObjectType()
export class UserModel {
    @Field(() => Int) id: number;
    @Field(() => String) username: string;
    @Field(() => String, { nullable: true }) nick?: string;
    @Field(() => Int) balance: number;
    @Field(() => String, { nullable: true }) img?: string;
    @Field(() => String, { nullable: true }) desc?: string;
    @Field(() => Int) levelAccess: number;
    @Field(() => Int, { nullable: process.env.NODE_ENV !== "production" }) vkId: number;
    @Field() updatedAt: Date;
    @Field() createdAt: Date;

    @Field(() => [ArticleModel], { nullable: true }) articles?: ArticleModel[];
    @Field(() => [SaleModel], { nullable: true }) sales?: SaleModel[];
    @Field(() => CountryModel, { nullable: true }) countr?: CountryModel;
    @Field(() => [OrgModel], { nullable: true }) orgs?: OrgModel[]
};

@ObjectType()
export class TokenModel {
    @Field(() => String) access_token: string;
    @Field(() => String) refresh_token: string;
};

@ObjectType()
export class ManyUserModel extends ManyModelClass {
    @Field(() => [UserModel]) items: UserModel[];
};
@ObjectType()
export class ItemUserModel {
    @Field(() => UserModel) item: UserModel;
};

@ObjectType()
export class DualUserModel {
    @Field(() => UserModel) user1: UserModel;
    @Field(() => UserModel) user2: UserModel;
};

@ObjectType()
export class TokenItemUser extends ItemUserModel {
    @Field(() => TokenModel)
    token: TokenModel;
};