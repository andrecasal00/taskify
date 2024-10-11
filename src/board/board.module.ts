import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [PrismaModule]
})
export class BoardModule {}
