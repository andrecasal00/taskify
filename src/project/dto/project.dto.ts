import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator"

export class ProjectDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'project name', required: true})
    name: string

    @IsOptional()
    @ApiProperty({description: 'project background image', required: false})
    backgroundImage: string
    
    @IsOptional()
    @IsString()
    @ApiProperty({description: 'project visibility uuid', required: false})
    visibilityUuid: string
    
    @IsOptional()
    @IsString()
    @ApiProperty({description: 'project description', required: false})
    description: string
}

export class MemberDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'user email', required: true})
    email: string
}