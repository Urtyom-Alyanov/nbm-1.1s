import { Field, InputType, Int } from "@nestjs/graphql";
import { IsHash, IsNumber, IsString, Matches, MaxLength, MinLength, IsOptional } from "class-validator";
import md5 from "md5";
import { Match } from "src/validator/Match.decorator";
import { vk } from "conf.json";

@InputType()
export class RegisterInput {
    @Field()
    @Match(RegisterInput, e => e.password, { message: "Пароли не совпадают" })
    passwordRetry: string;

    @Field()
    @IsString()
    @MinLength(4, { message: "Пароль меньше 4 символов" })
    @MaxLength(24, { message: "Пароль более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Пароли могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    password: string;

    @Field()
    @IsString()
    @MinLength(4, { message: "Логин меньше 4 символов" })
    @MaxLength(24, { message: "Логин более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Логины могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    username: string;

    @Field(() => Int)
    @IsNumber()
    vkId: number;

    @Field()
    @IsHash("md5", { message: "Хеш от ВК не был передвн" })
    @Match(RegisterInput, e => md5(`${vk.app_id}${e.vkId}${vk.secret}`), { message: "Неверный хеш от ВК" })
    vkHash: string;

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
};