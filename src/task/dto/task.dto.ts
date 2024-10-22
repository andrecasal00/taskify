import { ApiProperty } from '@nestjs/swagger';
import {
  isArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'task title', required: true })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'task description', required: false })
  description: string;

  @IsOptional()
  @IsDateString() // So @IsISO8601() considers 2021/04/19 to be invalid, but 2021-04-19 to be valid.
  @ApiProperty({ description: 'task due date', required: false })
  dueDate: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'task tags list',
    required: false,
    isArray: true,
  })
  tagsList: Array<string>;
}

export class AssociateToTaskDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'user email', required: true })
  email: string;
}
