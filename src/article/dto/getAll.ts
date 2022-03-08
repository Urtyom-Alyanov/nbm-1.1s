import { IsNumber, IsOptional, Min } from "class-validator";
import { FindAllArgs } from "src/user/dto/findAll.dto";

export class FindAllArticles extends FindAllArgs {
    @IsOptional()
    @IsNumber()
    @Min(0)
    userId?: number;
}