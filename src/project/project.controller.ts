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
import { GetCurrentUserUuid } from 'src/shared/decorators/current-user-uuid.decorator';
import { AccessTokenGuard } from 'src/shared/guards';
import { MemberDto, ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

//@Controller(':workspace_uuid')

@Controller('workspace/:workspace_uuid/project/')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @GetCurrentUserUuid() userUuid: string,
    @Param('workspace_uuid') workspaceUuid,
    @Body() dto: ProjectDto,
    @Req() req: Request
  ) {
    return this.projectService.createProject(userUuid, workspaceUuid, dto, req);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProjects(
    @GetCurrentUserUuid() userUuid: string,
    @Param('workspace_uuid') workspaceUuid,
  ) {
    return this.projectService.getUserProjects(userUuid, workspaceUuid);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:project_uuid')
  @HttpCode(HttpStatus.CREATED)
  async deleteproject(
    @GetCurrentUserUuid() userUuid: string,
    @Param('project_uuid') projectUuid,
  ) {
    return this.projectService.deleteProject(projectUuid, userUuid);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:project_uuid/membership')
  @HttpCode(HttpStatus.CREATED)
  async addMemberToProject(
    @GetCurrentUserUuid() userUuid: string,
    @Body() data: MemberDto,
    @Param('project_uuid') projectUuid,
  ) {
    console.log(`EMAIL : ${data.email}`)
    return this.projectService.addMemberToProject(data.email, projectUuid, userUuid);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:project_uuid/membership')
  @HttpCode(HttpStatus.CREATED)
  async removeMemberFromProject(
    @GetCurrentUserUuid() userUuid: string,
    @Body() data: MemberDto,
    @Param('project_uuid') projectUuid,
  ) {
    return this.projectService.removeMemberFromProject(data.email, projectUuid, userUuid);
  }
}
