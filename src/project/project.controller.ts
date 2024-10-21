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
import { ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('project')
@Controller('workspace/:workspace_uuid/project/')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: 'create a new project'})
  @ApiCreatedResponse({description: 'project created with success', type: ProjectDto})
  @ApiForbiddenResponse({description: 'user does not have permissions to create a project'})
  async createProject(
    @Body() dto: ProjectDto,
    @Req() req: Request
  ) {
    return this.projectService.createProject(dto, req);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'get all projects'})
  @ApiOkResponse({description: 'get a list of projects', type: ProjectDto, isArray: true})
  @ApiForbiddenResponse({description: 'user does not have permissions to get the projects'})
  async getProjects(
    @Req() req: Request
  ) {
    return this.projectService.getUserProjects(req);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:project_uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'delete a project'})
  @ApiOkResponse({description: 'project deleted with success'})
  @ApiForbiddenResponse({description: 'user does not have permissions to delete a project'})
  async deleteproject(
    @Req() req: Request
  ) {
    return this.projectService.deleteProject(req);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:project_uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'update a project'})
  @ApiOkResponse({description: 'project updated with success'})
  @ApiForbiddenResponse({description: 'user does not have permissions to update a project'})
  async updateProject(
    @Body() dto: ProjectDto,
    @Req() req: Request
  ) {
    return this.projectService.updateProject(dto, req);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:project_uuid/member')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: 'associate a member to a project'})
  @ApiCreatedResponse({description: 'member associate with success', type: MemberDto})
  @ApiForbiddenResponse({description: 'user does not have permissions to associate a member to a project'})
  async addMemberToProject(
    @Body() data: MemberDto,
    @Req() req: Request
  ) {
    return this.projectService.addMemberToProject(data.email, req);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:project_uuid/member')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'removes a member from a project'})
  @ApiOkResponse({description: 'member removed with success'})
  @ApiForbiddenResponse({description: 'user does not have permissions to remove a member from a project'})
  async removeMemberFromProject(
    @Body() data: MemberDto,
    @Req() req: Request
  ) {
    return this.projectService.removeMemberFromProject(data.email, req);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:project_uuid/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: 'get the members of a project'})
  @ApiCreatedResponse({description: 'get a list of members', type: MemberDto, isArray: true})
  @ApiForbiddenResponse({description: 'user does not have permissions to get a list of members'})
  async getProjectMembers(
    @Req() req: Request
  ) {
    return this.projectService.getProjectMembers(req);
  }
}
