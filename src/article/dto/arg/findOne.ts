import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, Min } from "class-validator";

@ArgsType()
export class FindOneArgs {
    @Field(() => Int)
    @IsNumber()
    @Min(1)
    id: number;
}