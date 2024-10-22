import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserUuid } from 'src/shared/decorators/current-user-uuid.decorator';
import { AccessTokenGuard } from 'src/shared/guards';
import { WorkspaceService } from './workspace.service';
import { WorkspaceDto } from './dto/workspace.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('workspace')
@Controller('workspace/')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'create a new workspace' })
  @ApiCreatedResponse({
    description: 'workspace created with success',
    type: WorkspaceDto,
  })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a workspace',
  })
  async createWorkspace(
    @GetCurrentUserUuid() userUuid: string,
    @Body() dto: WorkspaceDto,
  ) {
    return this.workspaceService.createWorkspace(userUuid, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get all user workspaces' })
  @ApiOkResponse({
    description: 'get a list of workspaces',
    type: WorkspaceDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to get the workspaces',
  })
  async getWorkspaces(@GetCurrentUserUuid() userUuid: string) {
    return this.workspaceService.getUserWorkspaces(userUuid);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:workspace_uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'deletes a workspace' })
  @ApiOkResponse({ description: 'workspace deleted with success' })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a workspace',
  })
  async deleteWorkspaces(
    @GetCurrentUserUuid() userUuid: string,
    @Param('workspace_uuid') workspaceUuid: string,
  ) {
    return this.workspaceService.deleteWorkspace(userUuid, workspaceUuid);
  }
}
