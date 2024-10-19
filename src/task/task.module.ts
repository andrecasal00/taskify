import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
import { ProjectAccessMiddleware } from 'src/project/project.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TaskService, JwtService],
  controllers: [TaskController],
  imports: [PrismaModule, SharedModule]
})
export class TaskModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectAccessMiddleware
      )
      .forRoutes(
        {
          path: 'workspace/:workspace_uuid/project/:project_uuid/board/:board_uuid/task/',
          method: RequestMethod.ALL,
        },
        {
          path: 'workspace/:workspace_uuid/project/:project_uuid/board/:board_uuid/task/:task_uuid',
          method: RequestMethod.ALL,
        },
        {
          path: 'workspace/:workspace_uuid/project/:project_uuid/board/:board_uuid/task/:task_uuid/member',
          method: RequestMethod.ALL,
        },
        {
          path: 'workspace/:workspace_uuid/project/:project_uuid/board/:board_uuid/task/:task_uuid/comment',
          method: RequestMethod.ALL,
        },
      );
  }
}
