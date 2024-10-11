import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { AccessTokenGuard } from 'src/shared/guards';
import { GetCurrentUserUuid } from 'src/shared/decorators/current-user-uuid.decorator';
import { BoardDto } from './dto/board.dto';

@Controller('workspace/:workspace_uuid/project/:project_uuid/board/')
export class BoardController {
    constructor(private boardService: BoardService) {}

    // add a new board
    @UseGuards(AccessTokenGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createBoard(
        @GetCurrentUserUuid() userUuid: string,
        @Param('workspace_uuid') workspaceUuid,
        @Param('project_uuid') projectUuid,
        @Body() dto: BoardDto,
    ) {
        
    }

    // delete a board
    @UseGuards(AccessTokenGuard)
    @Post('/:board_uuid')
    @HttpCode(HttpStatus.OK)
    async deleteBoard(
        @GetCurrentUserUuid() userUuid: string,
        @Param('workspace_uuid') workspaceUuid,
        @Param('project_uuid') projectUuid,
        @Param('board_uuid') boardUuid
    ) {
        
    }

    // get boards
    @UseGuards(AccessTokenGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async getBoards(
        @GetCurrentUserUuid() userUuid: string,
        @Param('workspace_uuid') workspaceUuid,
        @Param('project_uuid') projectUuid
    ) {
        
    }
}
