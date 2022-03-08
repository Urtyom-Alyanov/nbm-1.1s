import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ManyModelClass } from "src/others.model";
import { ProductModel } from "./product.model";

@ObjectType()
export class CatModel {
    @Field(() => Int) id: number;
    @Field(() => String) name: string;
    @Field(() => String, { nullable: true }) img?: string;
    @Field(() => String, { nullable: true }) desc?: string;
    @Field() updatedAt: Date;
    @Field() createdAt: Date;

    @Field(() => [ProductModel], { nullable: true }) products?: ProductModel[];
}

@ObjectType()
export class ManyCatModel extends ManyModelClass {
    @Field(() => [CatModel]) items: CatModel[];
};
@ObjectType()
export class ItemCatModel {
    @Field(() => CatModel) item: CatModel;
};