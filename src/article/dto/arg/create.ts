import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber, IsString, Min } from "class-validator";

@InputType()
export class CreateInputArticle {
    @Field()
    @IsString()
    title: string;

    @Field()
    @IsString()
    text: string;

    @Field()
    @IsString()
    img: string;
}

@InputType()
export class EditInputArticle extends CreateInputArticle {
    @Field(() => Int)
    @IsNumber()
    @Min(1)
    id: number;
}