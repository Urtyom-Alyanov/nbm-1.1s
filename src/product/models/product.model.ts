import { Field, ObjectType, Int } from "@nestjs/graphql";
import { OrgModel } from "src/org/org.model";
import { ManyModelClass } from "src/others.model";
import { UserModel } from "src/user/user.model";
import { CatModel } from "./cat.model";

@ObjectType()
export class ProductModel {
    @Field(() => Int) id: number;
    @Field(() => String) name: string;
    @Field(() => String, { nullable: true }) img?: string;
    @Field(() => String, { nullable: true }) desc?: string;
    @Field() updatedAt: Date;
    @Field() createdAt: Date;
    @Field() isPublished: boolean;

    @Field(() => Int) sale: number;
    @Field(() => Int, { nullable: true }) selfSale?: number;
    @Field(() => Int, { nullable: true }) count?: number;
    @Field(() => Int) productType: number;

    @Field(() => CatModel, { nullable: true }) category?: CatModel;
    @Field(() => OrgModel) org: OrgModel;
    @Field(() => [SaleModel]) sales: SaleModel[];
};

@ObjectType()
export class ManyProductModel extends ManyModelClass {
    @Field(() => [ProductModel]) items: ProductModel[];
};
@ObjectType()
export class ItemProductModel {
    @Field(() => ProductModel) item: ProductModel;
};

@ObjectType()
export class SaleModel {
    @Field(() => Int) id: number;
    @Field(() => String, { nullable: true }) img?: string;
    @Field(() => String, { nullable: true }) desc?: string;
    @Field() updatedAt: Date;
    @Field() createdAt: Date;
    @Field() items: number;
    @Field(() => UserModel) user: UserModel;
    @Field(() => ProductModel) product: ProductModel;
};

@ObjectType()
export class ManySaleModel extends ManyModelClass {
    @Field(() => [SaleModel]) items: SaleModel[];
};
@ObjectType()
export class ItemSaleModel {
    @Field(() => SaleModel) item: SaleModel;
};