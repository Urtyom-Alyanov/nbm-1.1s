import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

@ArgsType()
export class FindOneArgs {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Min(1)
  @IsNumber()
  orgId?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Min(1)
  @IsNumber()
  imageId?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Min(1)
  @IsNumber()
  countryId?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Min(1)
  @IsNumber()
  id?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Min(1)
  @IsNumber()
  vkId?: number;

  @IsOptional()
  @Field({ nullable: true })
  @IsString()
  username?: string;

  @IsOptional()
  @Field({ nullable: true })
  @IsNumber()
  @Min(1)
  cartId?: number;
}
