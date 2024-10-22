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
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('board')
@Controller('workspace/:workspace_uuid/project/:project_uuid/board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  // add a new board
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'creates a new board' })
  @ApiCreatedResponse({
    description: 'board created with success',
    type: BoardDto,
  })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a board',
  })
  async createBoard(@Body() dto: BoardDto, @Req() req) {
    return this.boardService.createBoard(dto, req);
  }

  // delete a board
  @UseGuards(AccessTokenGuard)
  @Delete('/:board_uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete a board from a project' })
  @ApiOkResponse({ description: 'board deleted with success' })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a board',
  })
  async deleteBoard(@Param('board_uuid') boardUuid, @Req() req) {
    return this.boardService.deleteBoard(boardUuid, req);
  }

  // update a board
  @UseGuards(AccessTokenGuard)
  @Patch('/:board_uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update a board from a project' })
  @ApiOkResponse({ description: 'board updated with success' })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a board',
  })
  async updateBoard(
    @Param('board_uuid') boardUuid,
    @Req() req,
    @Body() dto: BoardDto,
  ) {
    return this.boardService.updateBoard(boardUuid, req, dto);
  }

  // get boards
  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get all boards from a project' })
  @ApiOkResponse({
    description: 'list of boards',
    type: BoardDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'user does not have permissions to create a board',
  })
  async getBoards(@Req() req) {
    return this.boardService.getBoards(req);
  }
}
