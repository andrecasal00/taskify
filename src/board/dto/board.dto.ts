import { IsString } from "@nestjs/class-validator"
import { IsNotEmpty, IsOptional, IsUrl } from "class-validator"

export class BoardDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsOptional()
    @IsUrl({}, { message: 'Profile picture must be a valid URL.'})
    backgroundImage: string
}