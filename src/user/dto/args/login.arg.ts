import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsHash, IsNumber, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import { Match } from "src/validator/Match.decorator";
import md5 from "md5";
import { vk } from "../../../../conf.json";

@ArgsType()
export class LoginArgs {
    @Field(() => Int, { nullable: true })
    @ValidateIf(u => u.vkId || !u.username)
    @IsNumber()
    vkId: number;

    @Field({ nullable: true })
    @ValidateIf(u => !u.vkId || u.username)
    @MinLength(4, { message: "Логин меньше 4 символов" })
    @MaxLength(24, { message: "Логин более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Логины могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    @IsString()
    username: string;

    @Field({ nullable: true })
    @ValidateIf(u => !u.vkId || u.username)
    @MinLength(4, { message: "Пароль меньше 4 символов" })
    @MaxLength(24, { message: "Пароль более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Пароли могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    @IsString()
    password: string;

    @Field({ nullable: true })
    @ValidateIf(u => u.vkId || !u.username)
    @IsHash("md5", { message: "Хеш от ВК не был передвн" })
    @Match(LoginArgs, e => e => md5(`${vk.app_id}${e.vkId}${vk.secret}`), { message: "Неверный хеш от ВК" })
    vkHash: string;
}