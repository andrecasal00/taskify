import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AccessTokenGuard } from 'src/shared/guards';
import { AssociateToTaskDto, TaskDto } from './dto/task.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('task')
@Controller(
  'workspace/:workspace_uuid/project/:project_uuid/board/:board_uuid/task/',
)
export class TaskController {
  constructor(private taskService: TaskService) {}

  // create a new task
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'create a task' })
  @ApiCreatedResponse({
    description: 'task created with success',
    type: TaskDto,
  })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a task',
  })
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
  @ApiOperation({ summary: 'get all tasks' })
  @ApiOkResponse({ description: 'list of tasks', type: TaskDto, isArray: true })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to get all tasks',
  })
  async getTasks(@Param('board_uuid') boardUuid: string, @Req() req) {
    return this.taskService.getTasks(boardUuid, req);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':task_uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete a task' })
  @ApiOkResponse({ description: 'task deleted with success' })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to delete a task',
  })
  async deleteTask(@Param('task_uuid') taskUuid: string, @Req() req) {
    return this.taskService.deleteTask(taskUuid, req);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':task_uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update a task' })
  @ApiOkResponse({ description: 'task updated with success' })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to update a task',
  })
  async updateTask(
    @Param('task_uuid') taskUuid: string,
    @Body() dto: TaskDto,
    @Req() req,
  ) {
    return this.taskService.updateTask(taskUuid, dto, req);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':task_uuid/member')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'associate a user to a task' })
  @ApiCreatedResponse({
    description: 'user associated with success',
    type: AssociateToTaskDto,
  })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a task',
  })
  async associateMemberToTask(
    @Param('task_uuid') taskUuid: string,
    @Body() dto: AssociateToTaskDto,
    @Req() req,
  ) {
    return this.taskService.associateMemberToTask(dto.email, taskUuid, req);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':task_uuid/member')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'remove a user from a task' })
  @ApiOkResponse({ description: 'user removed from task with success' })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a task',
  })
  async removeMemberFromTask(
    @Param('task_uuid') taskUuid: string,
    @Body() dto: AssociateToTaskDto,
    @Req() req,
  ) {
    return this.taskService.removeMemberFromTask(dto.email, taskUuid, req);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':task_uuid/comment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'create a task comment' })
  @ApiCreatedResponse({ description: 'task comment created with success' })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a task',
  })
  async setTaskComment(
    @Param('task_uuid') taskUuid: string,
    @Body() data: string,
    @Req() req,
  ) {
    console.log(`body: ${data['message']}`);
    return this.taskService.setTaskComment(taskUuid, data['message'], req);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':task_uuid/comment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get all comments from a task' })
  @ApiOkResponse({ description: 'get a list of comments', type: TaskDto })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to comment a task',
  })
  async getTaskComments(
    @Param('task_uuid') taskUuid: string,
    @Body() data: string,
    @Req() req,
  ) {
    return this.taskService.getTaskComments(taskUuid, req);
  }
}
