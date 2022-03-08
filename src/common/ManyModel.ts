import { Field, ObjectType } from '@nestjs/graphql';
import { ManyInfoModel } from './others.model';

export interface ClassType<T = any> {
  new (...args: any[]): T;
}

export interface IManyModel<TItemsFieldValue> {
  items: TItemsFieldValue[];
  info: ManyInfoModel;
}

export function ManyModel<TItemsFieldValue>(
  itemsFieldValue: ClassType<TItemsFieldValue>,
): ClassType<IManyModel<TItemsFieldValue>> {
  @ObjectType(`Many${itemsFieldValue.name}Model`)
  class ManyModelClass implements IManyModel<TItemsFieldValue> {
    @Field(() => [itemsFieldValue], { nullable: 'items' })
    items: TItemsFieldValue[];

    @Field({ nullable: false })
    info: ManyInfoModel;
  }

  return ManyModelClass;
}

export interface IResponseModel<TItemsFieldValue> {
  item: TItemsFieldValue;
}

export function ResponseModel<TItemsFieldValue>(
  itemsFieldValue: ClassType<TItemsFieldValue>,
): ClassType<IResponseModel<TItemsFieldValue>> {
  @ObjectType(`Reponse${itemsFieldValue.name}Model`)
  class ReponseModelClass implements IResponseModel<TItemsFieldValue> {
    @Field(() => itemsFieldValue)
    item: TItemsFieldValue;
  }

  return ReponseModelClass;
}
