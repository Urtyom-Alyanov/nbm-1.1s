import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

@InputType()
export class CreateInputProduct {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsOptional()
  @IsString()
  text?: string;

  @Field(() => Int)
  @IsOptional()
  @IsString()
  imgId?: number;

  @Field(() => Int)
  @IsNumber()
  @Min(5)
  sale: number;

  @Field()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @Field(() => Int)
  @ValidateIf((u: CreateInputProduct) => u.productType === 1)
  @IsNumber()
  @Min(5)
  selfSale?: number;

  @Field(() => Int)
  @IsOptional()
  @IsNumber()
  @Min(1)
  catId?: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  oId: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Max(2)
  productType: number;

  @Field(() => Int)
  @ValidateIf((u: CreateInputProduct) => u.productType === 1)
  @IsNumber()
  @Min(10)
  count?: number;
}

@InputType()
export class EditInputProduct {
  @Field()
  @IsOptional()
  @IsString()
  name?: string;

  @Field()
  @IsOptional()
  @IsString()
  text?: string;

  @Field(() => Int)
  @IsOptional()
  @IsString()
  imgId?: number;

  @Field(() => Int)
  @IsOptional()
  @IsNumber()
  @Min(1)
  catId?: number;

  @Field()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @Field(() => Int)
  @IsOptional()
  @IsNumber()
  @Min(1)
  sale?: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  id: number;
}
