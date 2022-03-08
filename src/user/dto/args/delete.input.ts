import { InputType, Field } from "@nestjs/graphql";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

@InputType()
export class DeleteArgs {
    @Field()
    @MinLength(4, { message: "Логин меньше 4 символов" })
    @MaxLength(24, { message: "Логин более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Логины могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    @IsString()
    username: string;

    @Field()
    @MinLength(4, { message: "Пароль меньше 4 символов" })
    @MaxLength(24, { message: "Пароль более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Пароли могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    @IsString()
    password: string;

}