import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

@InputType()
export class CreateCategory {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsOptional()
    @IsString()
    desc?: string;

    @Field()
    @IsOptional()
    @IsString()
    img?: string;
};

@InputType()
export class EditCategory extends CreateCategory {
    @Field(() => Int)
    @IsNumber()
    @Min(1)
    id: number;
};

@ArgsType()
export class FindOneCat {
    @Field(() => Int)
    @IsOptional()
    @IsNumber()
    @Min(1)
    id?: number;

    @Field(() => Int)
    @IsOptional()
    @IsNumber()
    @Min(1)
    pId?: number;
};