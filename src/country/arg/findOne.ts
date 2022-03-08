import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';

@ArgsType()
export class FindOneCountry {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Field(() => Int, { nullable: true })
  oId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Field(() => Int, { nullable: true })
  uId?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(1)
  id?: number;
}
