import { IsHash, IsNumber, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import { Match } from "src/validator/Match.decorator";
import md5 from "md5";
import { vk } from "../../../conf.json";

export class Login {
    @ValidateIf(u => u.vkId || !u.username)
    @IsNumber()
    vkId: number;

    @ValidateIf(u => !u.vkId || u.username)
    @MinLength(4, { message: "Логин меньше 4 символов" })
    @MaxLength(24, { message: "Логин более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Логины могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    @IsString()
    username: string;

    @ValidateIf(u => !u.vkId || u.username)
    @MinLength(4, { message: "Пароль меньше 4 символов" })
    @MaxLength(24, { message: "Пароль более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Пароли могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    @IsString()
    password: string;

    @ValidateIf(u => u.vkId || !u.username)
    @IsHash("md5", { message: "Хеш от ВК не был передвн" })
    @Match(Login, e => md5(`${vk.app_id}${e.vkId}${vk.secret}`), { message: "Неверный хеш от ВК" })
    vkHash?: string;
}