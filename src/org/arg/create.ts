import { InputType, Field, Int } from "@nestjs/graphql";
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";

@InputType()
export class CreateInputOrg {
    @Field(() => Int)
    @IsNumber()
    @Min(1)
    cId: number;

    @Field()
    @IsString()
    title: string;

    @IsOptional()
    @Field({nullable: true})
    @IsString()
    text?: string;

    @IsOptional()
    @Field({nullable: true})
    @IsString()
    imgId?: number;

    @IsOptional()
    @Field(() => Int, {nullable: true})
    @IsNumber()
    @Min(0)
    balance?: number;

    @IsOptional()
    @Field({nullable: true})
    @IsBoolean()
    isPublished?: boolean;
};

@InputType()
export class EditInputOrg extends CreateInputOrg {
    @Field(() => Int)
    @IsNumber()
    @Min(1)
    id: number;
};