import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, Min } from "class-validator";
import { FindAllArgs } from "src/user/dto/findAll.dto";

@ArgsType()
export class FindAllOrg extends FindAllArgs {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(1)
    uId?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(1)
    cId?: number;
};