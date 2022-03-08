import { Field, Int, ObjectType } from "@nestjs/graphql";
import { OrgModel } from "src/org/org.model";
import { ManyModelClass } from "src/others.model";
import { UserModel } from "src/user/user.model";

@ObjectType()
export class CountryModel {
    @Field(() => Int) id: number;
    @Field(() => String) name: string;
    @Field(() => String, { nullable: true }) img?: string;
    @Field(() => String, { nullable: true }) desc?: string;
    @Field() updatedAt: Date;
    @Field() createdAt: Date;
    @Field() balance: number;
    @Field() isPublished: boolean;

    @Field(() => UserModel) user: UserModel;
    @Field(() => [OrgModel]) orgs?: OrgModel[];
};

@ObjectType()
export class ManyCountryModel extends ManyModelClass {
    @Field(() => [CountryModel]) items: CountryModel[];
};
@ObjectType()
export class ItemCountryModel {
    @Field(() => CountryModel) item: CountryModel;
};