import { IsString } from "@nestjs/class-validator"
import { IsNotEmpty, IsOptional, IsUrl } from "class-validator"

export class BoardDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsOptional()
    @IsString()
    backgroundImage: string
}