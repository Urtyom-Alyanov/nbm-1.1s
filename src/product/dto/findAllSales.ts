import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, Min } from "class-validator";
import { FindAllArgs } from "src/user/dto/args/findAll.arg";

@ArgsType()
export class FindAllSales extends FindAllArgs {
    @IsOptional()
    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    userId?: number;

    @IsOptional()
    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    productId?: number;
}