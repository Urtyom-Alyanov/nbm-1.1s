import { IsHash, IsNumber, IsString, Matches, MaxLength, MinLength, IsOptional } from "class-validator";
import md5 from "md5";
import { Match } from "src/validator/Match.decorator";
import { vk } from "../../../conf.json";

export class Register {
    @Match(Register, e => e.password, { message: "Пароли не совпадают" })
    passwordRetry: string;

    @IsString()
    @MinLength(4, { message: "Пароль меньше 4 символов" })
    @MaxLength(24, { message: "Пароль более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Пароли могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    password: string;

    @IsString()
    @MinLength(4, { message: "Логин меньше 4 символов" })
    @MaxLength(24, { message: "Логин более 24 символов" })
    @Matches(/[1-9a-zA-Z._\-@]+/, { message: "Логины могут иметь только цифры, латинск. буквы, а также знаки '_ - @ .'." })
    username: string;

    @IsNumber()
    vkId: number;

    @IsHash("md5", { message: "Хеш от ВК не был передвн" })
    @Match(Register, e => md5(`${vk.app_id}${e.vkId}${vk.secret}`), { message: "Неверный хеш от ВК" })
    vkHash: string;

    @IsOptional()
    img?: string;

    @IsOptional()
    nick?: string;

    @IsOptional()
    desc?: string;
};