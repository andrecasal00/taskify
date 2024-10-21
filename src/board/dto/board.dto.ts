import { IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsUrl } from "class-validator"

export class BoardDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'board name', required: true})
    name: string

    @IsOptional()
    @IsString()
    @ApiProperty({description: 'board background image', required: false})
    backgroundImage: string
}