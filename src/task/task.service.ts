import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDto } from './dto/task.dto';
import { Request } from 'express';
import { UserValidations } from 'src/shared/utilities/user.validations';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService, private userValidations: UserValidations) { }

    async createTask(boardUuid: string, dto: TaskDto, req: Request) {
        if (!req['project_access'].hasAccess) {
            throw new ForbiddenException('Access denied');
        }

        const userUuid = req['project_access'].userUuid;

        if ((await this.userValidations.isNotGuestMember(userUuid)).valueOf() || req['project_access'].isOwner) {
            const task = await this.prisma.tasks.create({
                data: {
                    boardUuid: boardUuid,
                    title: dto.title,
                    description: dto.description,
                    dueDate: dto.dueDate,
                    tagsList: dto.tagsList.toString()
                },
            });
            return {
                statusCode: HttpStatus.CREATED,
                message: "Task created with success",
                data: task,
            };
        } else {
            throw new ForbiddenException(
                "You don't have permissions to create a new task!",
            );
        }
    }

    async getTasks(boardUuid: string, req: Request) {
        if (!req['project_access'].hasAccess) {
            throw new ForbiddenException('Access denied');
        }

        const tasks = await this.prisma.tasks.findMany({
            where: {
                boardUuid: boardUuid,
            },
        });
        return {
            statusCode: HttpStatus.OK,
            data: tasks,
        };
    }

    async deleteTask(taskUuid: string, req: Request) {
        if (!req['project_access'].hasAccess) {
            throw new ForbiddenException('Access denied');
        }

        const userUuid = req['project_access'].userUuid;

        if ((await this.userValidations.isNotGuestMember(userUuid)).valueOf() || req['project_access'].isOwner) {
            const tasks = await this.prisma.tasks.deleteMany({
                where: {
                    uuid: taskUuid,
                },
            });
            return {
                statusCode: HttpStatus.OK,
                message: "Task deleted with success",
            };
        } else {
            throw new ForbiddenException(
                "You don't have permissions to delete a task!",
            );
        }
        
    }

    async updateTask(taskUuid: string, dto: TaskDto, req: Request) {
        if (!req['project_access'].hasAccess) {
            throw new ForbiddenException('Access denied');
        }

        const userUuid = req['project_access'].userUuid;

        if ((await this.userValidations.isNotGuestMember(userUuid)).valueOf() || req['project_access'].isOwner) {
            const task = await this.prisma.tasks.update({
                where: {
                    uuid: taskUuid,
                },
                data: {
                    title: dto.title,
                    description: dto.description,
                    dueDate: dto.dueDate,
                    tagsList: dto.tagsList.toString()
                }
            });
            return {
                statusCode: HttpStatus.OK,
                message: "Task updated with success",
                data: task
            };
        } else {
            throw new ForbiddenException(
                "You don't have permissions to update a task!",
            );
        }
    }
}
