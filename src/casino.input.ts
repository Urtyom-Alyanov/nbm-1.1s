import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber, Max, Min } from "class-validator";

@InputType()
export class CasinoInput {
    @IsNumber()
    @Min(1)
    @Field(() => Int)
    summ: number;

    @IsNumber()
    @Min(5)
    @Max(95)
    @Field(() => Int)
    fortune: number;
};