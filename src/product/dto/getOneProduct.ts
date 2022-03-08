import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, Min } from "class-validator";

@ArgsType()
export class FindOneProduct {
    @Field(() => Int)
    @IsOptional()
    @IsNumber()
    @Min(1)
    id?: number;

    @Field(() => Int)
    @IsOptional()
    @IsNumber()
    @Min(1)
    sId?: number;
}