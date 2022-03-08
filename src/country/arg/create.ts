import { Field, InputType, Int } from "@nestjs/graphql";
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";

@InputType()
export class CreateInputCountry {
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
    img?: string;

    @IsOptional()
    @Field(() => Int, {nullable: true})
    @IsNumber()
    @Min(0)
    balance?: number;

    @IsOptional()
    @Field({nullable: true})
    @IsBoolean()
    isPublished?: boolean;

    @IsOptional()
    @Field({nullable: true})
    @IsBoolean()
    onlyGov?: boolean;
}

@InputType()
export class EditInputCountry extends CreateInputCountry {
    @Field(() => Int)
    @IsNumber()
    @Min(1)
    id: number;
}