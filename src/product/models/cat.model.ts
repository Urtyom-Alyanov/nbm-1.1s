import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/baseModel';
import { ManyModel, ResponseModel } from 'src/common/ManyModel';
import { ProductModel } from './product.model';

@ObjectType()
export class CatModel extends BaseModel {
  @Field(() => String) name: string;

  @Field(() => [ProductModel], { nullable: true }) products?: ProductModel[];
}

export const ManyCatModel = ManyModel(CatModel);
export type ManyCatModel = InstanceType<typeof ManyCatModel>;

export const ItemCatModel = ResponseModel(CatModel);
export type ItemCatModel = InstanceType<typeof ItemCatModel>;
