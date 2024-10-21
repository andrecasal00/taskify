import { IsEmail, IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger";
import { IsUrl, Matches, MinLength } from "class-validator";

export class AuthDto {
    @ApiProperty({description: 'user email', required: true})
    @IsNotEmpty()
    @IsEmail()
    email: string
    @ApiProperty({description: 'user password', required: true})
    @IsNotEmpty()
    @IsString()
    password: string
}

export class CreateAccountDto {
    @ApiProperty({description: 'user email', required: true})
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'user password', required: true})
    /*@MinLength(8, { message: 'Password must be at least 8 characters long.' })
     @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: 'Password must include upper and lower case letters, numbers, and special characters.',
    }) */
    password: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'user name', required: true})
    name: string;
  
    @IsOptional()
    @IsUrl({}, { message: 'Profile picture must be a valid URL.' })
    @ApiProperty({description: 'user profile picture url', required: false})
    profilePicture?: string; // Made optional
  
    @IsOptional()
    /*@Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid international format.' })*/
    @ApiProperty({description: 'user phone number', required: false})
    phoneNumber?: string; // Made optional, and added validation for phone numbers
  
    @IsOptional()
    @IsString()
    @ApiProperty({description: 'user description', required: false})
    bio?: string; // Made optional
  }