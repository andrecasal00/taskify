import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
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
    @Body() dto: ProjectDto,
    @Req() req: Request
  ) {
    return this.projectService.createProject(dto, req);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProjects(
    @Req() req: Request
  ) {
    return this.projectService.getUserProjects(req);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:project_uuid')
  @HttpCode(HttpStatus.CREATED)
  async deleteproject(
    @Req() req: Request
  ) {
    return this.projectService.deleteProject(req);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:project_uuid')
  @HttpCode(HttpStatus.CREATED)
  async updateProject(
    @Body() dto: ProjectDto,
    @Req() req: Request
  ) {
    return this.projectService.updateProject(dto, req);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:project_uuid/member')
  @HttpCode(HttpStatus.CREATED)
  async addMemberToProject(
    @Body() data: MemberDto,
    @Req() req: Request
  ) {
    return this.projectService.addMemberToProject(data.email, req);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:project_uuid/member')
  @HttpCode(HttpStatus.CREATED)
  async removeMemberFromProject(
    @Body() data: MemberDto,
    @Req() req: Request
  ) {
    return this.projectService.removeMemberFromProject(data.email, req);
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
