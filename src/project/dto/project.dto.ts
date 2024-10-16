import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator"

export class ProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsOptional()
    @IsUrl({}, { message: 'Profile picture must be a valid URL.'})
    backgroundImage: string
    
    @IsOptional()
    @IsString()
    visibilityUuid: string
    
    @IsOptional()
    @IsString()
    description: string
}

export class MemberDto {
    @IsString()
    @IsNotEmpty()
    email: string
}