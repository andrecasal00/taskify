import { ConflictException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

    async associateMemberToTask(targetEmail: string, taskUuid:string, req: Request) {
        if (!req['project_access'].hasAccess) {
            throw new ForbiddenException('Access denied');
        }

        const userUuid = req['project_access'].userUuid;

        if ((await this.userValidations.isNotGuestMember(userUuid)).valueOf() || req['project_access'].isOwner) {
            // Step 3: Check if the user with the target email exists
            const user = await this.prisma.users.findUnique({
                where: { email: targetEmail },
                select: { uuid: true },
            });

            if (!user) {
                throw new NotFoundException('Email not found');
            }

            // Step 4: Check if the user is in the project
            const isMemberInProject = await this.userValidations.isMemberInProject(
                user.uuid,
                req['project_access'].projectUuid,
            );

            if (await this.userValidations.isOwnerEmail(targetEmail, req['project_access'].projectUuid)) {
                
            } else {
                if (isMemberInProject.length <= 0) {
                    throw new ConflictException(
                        'The member you are trying to associate is not in this project!',
                    );
                }
            }

            // Step 4: Check if the user is already a member of the project
            const isMemberInTask = await this.userValidations.isMemberInTask(
                user.uuid,
                taskUuid,
            );
            if (isMemberInTask.length > 0) {
                throw new ConflictException(
                    'The member you are trying to associate to this task is already associated!',
                );
            }
            // Step 6: Add the user as a member to the task
            const projectMember = await this.prisma.taskMembers.create({
                data: {
                    associatedToUuid: user.uuid,
                    taksUuid: taskUuid,
                },
            });

            // Step 7: Return success response
            return {
                statusCode: HttpStatus.CREATED,
                message: 'The member was associated to this task with success!',
                data: projectMember,
            };
        } else {
            throw new ForbiddenException(
                "You don't have permissions to associate a member to a task!",
            );
        }
    }

    async removeMemberFromTask(targetEmail: string, taskUuid:string, req: Request) {
        // Step 1: Validate if the current user is the owner of the project or has access
    if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
        throw new ForbiddenException('Access denied');
      }
      
      const userUuid = req['project_access'].userUuid;

      // Step 2: Check if the user has permissions to remove a member (owner or mod)
      if ((await this.userValidations.isNotGuestMember(userUuid)).valueOf() || req['project_access'].isOwner) {
        // Step 2: Check if the user with the target email exists
        const user = await this.prisma.users.findUnique({
          where: { email: targetEmail },
          select: { uuid: true },
        });
  
        if (!user) {
          throw new NotFoundException('Email not found');
        }
  
        // Step 3: Check if the user is already a member of the project
        const isMemberInTask = await this.userValidations.isMemberInTask(
          user.uuid,
          taskUuid,
        );
        if (isMemberInTask.length > 0) {
          await this.prisma.taskMembers.deleteMany({
            where: {
              associatedToUuid: user.uuid,
              taksUuid: taskUuid,
            },
          });
        } else {
          throw new ConflictException(
            'That email is not a associated to the task!',
          );
        }
      } else {
        throw new ForbiddenException("You don't have permissions to remove a member.")
      }
  
      return {
        statusCode: HttpStatus.OK,
        message: 'The member was removed with success!',
      };
    }

    async setTaskComment() {

    }
}
