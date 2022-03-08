import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/baseModel';
import { CountryModel } from 'src/country/country.model';
import { ManyModel, ResponseModel } from 'src/ManyModel';
import { ProductModel } from 'src/product/models/product.model';
import { UserModel } from 'src/user/user.model';

@ObjectType()
export class OrgModel extends BaseModel {
  @Field(() => String) name: string;
  @Field() balance: number;
  @Field() isPublished: boolean;

  @Field(() => UserModel) user: UserModel;
  @Field(() => [ProductModel], { nullable: true }) products?: ProductModel[];
  @Field(() => CountryModel, { nullable: true }) country?: CountryModel;
}

export const ManyOrgModel = ManyModel(OrgModel);
export type ManyOrgModel = InstanceType<typeof ManyOrgModel>;

export const ItemOrgModel = ResponseModel(OrgModel);
export type ItemOrgModel = InstanceType<typeof ItemOrgModel>;
