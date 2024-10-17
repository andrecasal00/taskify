import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/shared/guards';
import { MemberDto, ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller('workspace/:workspace_uuid/project/')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @Param('workspace_uuid') workspaceUuid,
    @Body() dto: ProjectDto,
    @Req() req: Request
  ) {
    return this.projectService.createProject(workspaceUuid, dto, req);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProjects(
    @Param('workspace_uuid') workspaceUuid,
    @Req() req: Request
  ) {
    return this.projectService.getUserProjects(workspaceUuid, req);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:project_uuid')
  @HttpCode(HttpStatus.CREATED)
  async deleteproject(
    @Param('project_uuid') projectUuid,
    @Req() req: Request
  ) {
    return this.projectService.deleteProject(projectUuid, req);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:project_uuid/membership')
  @HttpCode(HttpStatus.CREATED)
  async addMemberToProject(
    @Body() data: MemberDto,
    @Param('project_uuid') projectUuid,
    @Req() req: Request
  ) {
    return this.projectService.addMemberToProject(data.email, projectUuid, req);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:project_uuid/membership')
  @HttpCode(HttpStatus.CREATED)
  async removeMemberFromProject(
    @Body() data: MemberDto,
    @Param('project_uuid') projectUuid,
    @Req() req: Request
  ) {
    return this.projectService.removeMemberFromProject(data.email, projectUuid, req);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:project_uuid/members')
  @HttpCode(HttpStatus.CREATED)
  async getProjectMembers(
    @Req() req: Request
  ) {
    return this.projectService.getProjectMembers(req);
  }
}
