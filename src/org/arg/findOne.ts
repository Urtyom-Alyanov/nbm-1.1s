import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';

@ArgsType()
export class FindOneOrg {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Field(() => Int, { nullable: true })
  pId?: number;

  @IsOptional()
  @Field(() => Int)
  @IsNumber()
  @Min(1)
  id?: number;
}
