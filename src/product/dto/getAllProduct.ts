import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, Min } from "class-validator";
import { FindAllArgs } from "src/user/dto/args/findAll.arg";

@ArgsType()
export class FindManyProduct extends FindAllArgs {
    @Field(() => Int)
    @IsOptional()
    @IsNumber()
    @Min(1)
    catId?: number;

    @Field(() => Int)
    @IsOptional()
    @IsNumber()
    @Min(1)
    oId?: number;
}