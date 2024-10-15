import { IsEmail, IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator"
import { IsUrl, Matches, MinLength } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsNotEmpty()
    @IsString()
    password: string
}

export class CreateAccountDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: 'Password must include upper and lower case letters, numbers, and special characters.',
    })
    password: string;
  
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsUrl({}, { message: 'Profile picture must be a valid URL.' })
    profilePicture?: string; // Made optional
  
    @IsOptional()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid international format.' })
    phoneNumber?: string; // Made optional, and added validation for phone numbers
  
    @IsOptional()
    @IsString()
    bio?: string; // Made optional
  }