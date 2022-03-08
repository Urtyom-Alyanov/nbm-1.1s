import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ImagesEntity } from '../images/images.entity';

@ObjectType()
export class BaseModel {
  @Field(() => ID)
  id: number;

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;

  @Field(() => String, { nullable: true })
  desc?: string;

  @Field(() => ID, { nullable: true })
  img?: ImagesEntity;
}
