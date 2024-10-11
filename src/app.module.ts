import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [AuthModule, SharedModule, PrismaModule, WorkspaceModule, ProjectModule, TaskModule, BoardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
