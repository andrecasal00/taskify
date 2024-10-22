import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class WorkspaceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'workspace name', required: true })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'workspace description', required: false })
  description: string;

  @IsOptional()
  @ApiProperty({ description: 'workspace background image', required: false })
  backgroundImage: string;
}
