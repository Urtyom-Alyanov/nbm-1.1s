import { Field, ObjectType, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/common/baseModel';
import { CountryModel } from 'src/country/country.model';
import { ManyModel, ResponseModel } from 'src/common/ManyModel';
import { OrgModel } from 'src/org/org.model';
import { SaleModel } from 'src/product/models/product.model';

@ObjectType()
export class UserModel extends BaseModel {
  @Field(() => String) username: string;
  @Field(() => String, { nullable: true }) nick?: string;
  @Field(() => Int) balance: number;
  @Field(() => Int) levelAccess: number;
  @Field(() => Int, { nullable: process.env.NODE_ENV !== 'production' })
  vkId: number;

  @Field(() => [SaleModel], { nullable: true }) sales?: SaleModel[];
  @Field(() => CountryModel, { nullable: true }) countr?: CountryModel;
  @Field(() => [OrgModel], { nullable: true }) orgs?: OrgModel[];
}

export const ManyUserModel = ManyModel(UserModel);
export type ManyUserModel = InstanceType<typeof ManyUserModel>;

export const ItemUserModel = ResponseModel(UserModel);
export type ItemUserModel = InstanceType<typeof ItemUserModel>;

@ObjectType()
export class DualUserModel {
  @Field(() => UserModel) user1: UserModel;
  @Field(() => UserModel) user2: UserModel;
}
