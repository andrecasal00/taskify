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
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { AccessTokenGuard } from 'src/shared/guards';
import { GetCurrentUserUuid } from 'src/shared/decorators/current-user-uuid.decorator';
import { BoardDto } from './dto/board.dto';

@Controller('workspace/:workspace_uuid/project/:project_uuid/board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  // add a new board
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBoard(
    @Param('workspace_uuid') workspaceUuid,
    @Param('project_uuid') projectUuid,
    @Body() dto: BoardDto,
    @Req() req,
  ) {
    return this.boardService.createBoard(projectUuid, dto, req);
  }

  // delete a board
  @UseGuards(AccessTokenGuard)
  @Delete('/:board_uuid')
  @HttpCode(HttpStatus.OK)
  async deleteBoard(
    @Param('project_uuid') projectUuid,
    @Param('board_uuid') boardUuid,
    @Req() req
  ) {
    return this.boardService.deleteBoard(projectUuid, boardUuid, req);
  }

  // get boards
  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getBoards(@Param('project_uuid') projectUuid, @Req() req) {
    return this.boardService.getBoards(projectUuid, req);
  }
}
