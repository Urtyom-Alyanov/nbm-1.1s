import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "src/validator/Match.decorator";

@InputType()
export class EditUsernameInput {
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

@InputType()
export class EditPasswordInput {
    @Field()
    @MinLength(4, { message: "Новый пароль меньше 4 символов" })
    @MaxLength(24, { message: "Новый пароль более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Пароли могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    @IsString()
    passwordNew1: string;

    @Field()
    @Match(EditPasswordInput, e => e.passwordNew1, { message: "Пароли не совпадают" })
    passwordNew2: string;

    @Field()
    @MinLength(4, { message: "Старый пароль меньше 4 символов" })
    @MaxLength(24, { message: "Старый пароль более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Пароли могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    @IsString()
    passwordOld: string;
}

@InputType()
export class EditInput {
    @Field({ nullable: true })
    @IsOptional()
    img?: string;

    @Field({ nullable: true })
    @MaxLength(32, { message: "Ник более 32 символов" })
    @IsOptional()
    nick?: string;

    @Field({ nullable: true })
    @IsOptional()
    desc?: string;
}