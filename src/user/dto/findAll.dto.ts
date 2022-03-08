import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

@ArgsType()
export class FindAllArgs {
    @IsOptional()
    @Field(() => Int, { defaultValue: 1 })
    @IsNumber()
    @Min(1)
    page?=1;

    @IsOptional()
    @Field(() => Int, { defaultValue: 12 })
    @IsNumber()
    @Max(12)
    @Min(1)
    limit?=12;
}