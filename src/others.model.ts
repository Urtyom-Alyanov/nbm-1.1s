import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface ClassType<T = any> {
    new (...args: any[]): T;
}

@ObjectType()
export class ManyInfoModel {
    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    summ: number;
}

@ObjectType({ isAbstract: true })
export class ManyModelClass {
    @Field({ nullable: false })
    info: ManyInfoModel;
}

@ObjectType()
export class StatusModel {
    @Field()
    isOk: boolean;
}

import { InputType } from "@nestjs/graphql";
import { IsNumber, Min } from "class-validator";

@InputType()
export class PayInput {
    @Field(() => Int, { nullable: true })
    @Min(1)
    @IsNumber()
    id: number;

    @Field(() => Int, { nullable: true })
    @Min(1)
    @IsNumber()
    summ: number;
}