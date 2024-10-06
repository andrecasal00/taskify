import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ProjectService],
  controllers: [ProjectController],
  imports: [PrismaModule]
})
export class ProjectModule {}
