import { InputType, Field, Int } from "@nestjs/graphql";
import { IsBoolean, IsNumber, Min } from "class-validator";

@InputType()
export class LevelInput {
    @Field(() => Int, { nullable: true })
    @Min(1)
    @IsNumber()
    id: number;

    @Field(() => Int, { nullable: true })
    @IsBoolean()
    to: boolean;
}