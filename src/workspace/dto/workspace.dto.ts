import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator"

export class WorkspaceDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsUrl({}, { message: 'Profile picture must be a valid URL.' })
    backgroundImage: string
}