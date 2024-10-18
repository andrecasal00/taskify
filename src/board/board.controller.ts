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
import { BoardService } from './board.service';
import { AccessTokenGuard } from 'src/shared/guards';
import { BoardDto } from './dto/board.dto';

@Controller('workspace/:workspace_uuid/project/:project_uuid/board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  // add a new board
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBoard(
    @Body() dto: BoardDto,
    @Req() req,
  ) {
    return this.boardService.createBoard(dto, req);
  }

  // delete a board
  @UseGuards(AccessTokenGuard)
  @Delete('/:board_uuid')
  @HttpCode(HttpStatus.OK)
  async deleteBoard(
    @Param('board_uuid') boardUuid,
    @Req() req
  ) {
    return this.boardService.deleteBoard(boardUuid, req);
  }

  // update a board
  @UseGuards(AccessTokenGuard)
  @Patch('/:board_uuid')
  @HttpCode(HttpStatus.OK)
  async updateBoard(
    @Param('board_uuid') boardUuid,
    @Req() req,
    @Body() dto: BoardDto
  ) {
    return this.boardService.updateBoard(boardUuid, req, dto);
  }

  // get boards
  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getBoards(@Req() req) {
    return this.boardService.getBoards(req);
  }
}
