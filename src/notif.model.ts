import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class NotifyModel {
    @Field() title: string;
    @Field(() => ID) forId: number;
    @Field() text: string;
    @Field({ nullable: true }) img?: string;
    @Field() isCool: boolean;
    @Field() typ: string;
};