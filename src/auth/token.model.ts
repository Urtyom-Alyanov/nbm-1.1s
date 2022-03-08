import { Field, ObjectType } from '@nestjs/graphql';
import { ItemUserModel } from 'src/user/user.model';

@ObjectType()
export class TokenItemUser extends ItemUserModel {
  @Field(() => TokenModel)
  token: TokenModel;
}

@ObjectType()
export class TokenModel {
  @Field(() => String) access_token: string;
  @Field(() => String) refresh_token: string;
}
