import { Field, ObjectType, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/common/baseModel';
import { OrgModel } from 'src/org/org.model';
import { ManyModel, ResponseModel } from 'src/common/ManyModel';
import { UserModel } from 'src/user/user.model';
import { CatModel } from './cat.model';

@ObjectType()
export class ProductModel extends BaseModel {
  @Field(() => String) name: string;
  @Field() isPublished: boolean;

  @Field(() => Int) sale: number;
  @Field(() => Int, { nullable: true }) selfSale?: number;
  @Field(() => Int, { nullable: true }) count?: number;
  @Field(() => Int) productType: number;

  @Field(() => CatModel, { nullable: true }) category?: CatModel;
  @Field(() => OrgModel) org: OrgModel;
  @Field(() => [SaleModel]) sales: SaleModel[];
}

export const ManyProductModel = ManyModel(ProductModel);
export type ManyProductModel = InstanceType<typeof ManyProductModel>;

export const ItemProductModel = ResponseModel(ProductModel);
export type ItemProductModel = InstanceType<typeof ItemProductModel>;

@ObjectType()
export class SaleModel extends BaseModel {
  @Field(() => Int) items: number;
  @Field(() => UserModel) user: UserModel;
  @Field(() => ProductModel) product: ProductModel;
}

export const ManySaleModel = ManyModel(SaleModel);
export type ManySaleModel = InstanceType<typeof ManySaleModel>;

export const ItemSaleModel = ResponseModel(SaleModel);
export type ItemSaleModel = InstanceType<typeof ItemSaleModel>;
