import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [TaskService],
  controllers: [TaskController],
  imports: [PrismaModule]
})
export class TaskModule {}
