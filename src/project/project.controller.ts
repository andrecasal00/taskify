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
import { ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller(':workspace_uuid/project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @GetCurrentUserUuid() userUuid: string,
    @Param("workspace_uuid") workspaceUuid,
    @Body() dto: ProjectDto,
  ) {
    return this.projectService.createProject(userUuid, workspaceUuid, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProjects(@GetCurrentUserUuid() userUuid: string) {
    return this.projectService.getUserProjects(userUuid);
  }
}
