import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardDto } from './dto/board.dto';

@Injectable()
export class BoardService {
    constructor(private prisma: PrismaService) {}

    async createBoard(dto: BoardDto) {
        // verify if the user is the owner

        // if not, verify if it's a member of the project
    }
}
