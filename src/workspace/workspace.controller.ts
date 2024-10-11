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

@Controller('workspace/')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @GetCurrentUserUuid() userUuid: string,
    @Body() dto: WorkspaceDto,
  ) {
    return this.workspaceService.createWorkspace(userUuid, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getWorkspaces(
    @GetCurrentUserUuid() userUuid: string
  ) {
    return this.workspaceService.getUserWorkspaces(userUuid);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:workspace_uuid')
  @HttpCode(HttpStatus.OK)
  async deleteWorkspaces(
    @GetCurrentUserUuid() userUuid: string,
    @Param('workspace_uuid') workspaceUuid: string
  ) {
    return this.workspaceService.deleteWorkpace(userUuid, workspaceUuid);
  }
}
