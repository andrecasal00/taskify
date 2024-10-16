import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class TaskDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsDateString() // So @IsISO8601() considers 2021/04/19 to be invalid, but 2021-04-19 to be valid.
    dueDate: Date

    @IsOptional()
    @IsString()
    tagsList: Array<string>
}