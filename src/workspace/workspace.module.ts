import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [PrismaModule],
})
export class WorkspaceModule {}
