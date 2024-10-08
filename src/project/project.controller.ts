import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserUuid } from 'src/shared/decorators/current-user-uuid.decorator';
import { AccessTokenGuard } from 'src/shared/guards';
import { MemberDto, ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller(':workspace_uuid')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/project')
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @GetCurrentUserUuid() userUuid: string,
    @Param('workspace_uuid') workspaceUuid,
    @Body() dto: ProjectDto,
  ) {
    return this.projectService.createProject(userUuid, workspaceUuid, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/project')
  @HttpCode(HttpStatus.OK)
  async getProjects(
    @GetCurrentUserUuid() userUuid: string,
    @Param('workspace_uuid') workspaceUuid,
  ) {
    return this.projectService.getUserProjects(userUuid, workspaceUuid);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:project_uuid')
  @HttpCode(HttpStatus.CREATED)
  async addMemberToProject(
    @GetCurrentUserUuid() userUuid: string,
    @Body() data: MemberDto,
    @Param('project_uuid') projectUuid,
  ) {
    console.log(`EMAIL : ${data.email}`)
    return this.projectService.addMemberToProject(data.email, projectUuid, userUuid);
  }
}
