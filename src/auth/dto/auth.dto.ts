import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "@nestjs/class-validator"

export class AuthDto {
    email: string
    password: string
}

export class CreateAccountDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsNotEmpty()
    @IsString()
    password: string
    @IsNotEmpty()
    @IsString()
    name: string
    profilePicture: string
    phoneNumber: string
    bio: string
}