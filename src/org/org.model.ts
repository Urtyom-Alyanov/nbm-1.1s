import { Field, Int, ObjectType } from "@nestjs/graphql";
import { CountryModel } from "src/country/country.model";
import { ManyModelClass } from "src/others.model";
import { ProductModel } from "src/product/models/product.model";
import { UserModel } from "src/user/user.model";

@ObjectType()
export class OrgModel {
    @Field(() => Int) id: number;
    @Field(() => String) name: string;
    @Field(() => String, { nullable: true }) img?: string;
    @Field(() => String, { nullable: true }) desc?: string;
    @Field() updatedAt: Date;
    @Field() createdAt: Date;
    @Field() balance: number;
    @Field() isPublished: boolean;

    @Field(() => UserModel) user: UserModel;
    @Field(() => [ProductModel], { nullable: true }) products?: ProductModel[];
    @Field(() => CountryModel, { nullable: true }) country?: CountryModel;
};

@ObjectType()
export class ManyOrgModel extends ManyModelClass {
    @Field(() => [OrgModel]) items: OrgModel[];
};
@ObjectType()
export class ItemOrgModel {
    @Field(() => OrgModel) item: OrgModel;
};