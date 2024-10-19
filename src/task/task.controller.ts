import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { AccessTokenGuard } from 'src/shared/guards';
import { associateToTaskDto, TaskDto } from './dto/task.dto';

@Controller('workspace/:workspace_uuid/project/:project_uuid/board/:board_uuid/task/')
export class TaskController {
    constructor(private taskService: TaskService) {}

    // create a new task
    @UseGuards(AccessTokenGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createTask(
        @Param('board_uuid') boardUuid: string,
        @Body() dto: TaskDto,
        @Req() req,
    ) {
        return this.taskService.createTask(boardUuid, dto, req);
    }

    // get board tasks
    @UseGuards(AccessTokenGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async getTasks(
        @Param('board_uuid') boardUuid: string,
        @Req() req,
    ) {
        return this.taskService.getTasks(boardUuid, req);
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':task_uuid')
    @HttpCode(HttpStatus.OK)
    async deleteTask(
        @Param('task_uuid') taskUuid: string,
        @Req() req,
    ) {
        return this.taskService.deleteTask(taskUuid, req);
    }

    @UseGuards(AccessTokenGuard)
    @Patch(':task_uuid')
    @HttpCode(HttpStatus.OK)
    async updateTask(
        @Param('task_uuid') taskUuid: string,
        @Body() dto: TaskDto,
        @Req() req,
    ) {
        return this.taskService.updateTask(taskUuid, dto, req);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':task_uuid/member')
    @HttpCode(HttpStatus.OK)
    async associateMemberToTask(
        @Param('task_uuid') taskUuid: string,
        @Body() dto: associateToTaskDto,
        @Req() req,
    ) {
        return this.taskService.associateMemberToTask(dto.email, taskUuid, req);
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':task_uuid/member')
    @HttpCode(HttpStatus.OK)
    async removeMemberFromTask(
        @Param('task_uuid') taskUuid: string,
        @Body() dto: associateToTaskDto,
        @Req() req,
    ) {
        return this.taskService.removeMemberFromTask(dto.email, taskUuid, req);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':task_uuid/comment')
    @HttpCode(HttpStatus.OK)
    async setTaskComment(
        @Param('task_uuid') taskUuid: string,
        @Body() data: string,
        @Req() req,
    ) {
        console.log(`body: ${data['message']}`)
        return this.taskService.setTaskComment(taskUuid, data['message'], req);
    }

    @UseGuards(AccessTokenGuard)
    @Get(':task_uuid/comment')
    @HttpCode(HttpStatus.OK)
    async getTaskComments(
        @Param('task_uuid') taskUuid: string,
        @Body() data: string,
        @Req() req,
    ) {
        return this.taskService.getTaskComments(taskUuid, req);
    }
}
