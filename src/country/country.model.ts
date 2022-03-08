import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/baseModel';
import { ManyModel, ResponseModel } from 'src/common/ManyModel';
import { OrgModel } from 'src/org/org.model';
import { UserModel } from 'src/user/user.model';

@ObjectType()
export class CountryModel extends BaseModel {
  @Field(() => String) name: string;
  @Field() balance: number;
  @Field() isPublished: boolean;
  @Field() onlyGov: boolean;

  @Field(() => UserModel) user: UserModel;
  @Field(() => [OrgModel]) orgs?: OrgModel[];
}

export const ManyCountryModel = ManyModel(CountryModel);
export type ManyCountryModel = InstanceType<typeof ManyCountryModel>;

export const ItemCountryModel = ResponseModel(CountryModel);
export type ItemCountryModel = InstanceType<typeof ItemCountryModel>;
