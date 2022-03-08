import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, Min } from "class-validator";
import { FindAllArgs } from "src/user/dto/args/findAll.arg";

@ArgsType()
export class FindAllArticlesArg extends FindAllArgs {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    userId?: number;
}