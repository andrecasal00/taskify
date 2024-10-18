import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectAccessMiddleware } from './project.middleware';
import { JwtService } from '@nestjs/jwt';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  providers: [ProjectService, JwtService],
  controllers: [ProjectController],
  imports: [PrismaModule, SharedModule]
})
export class ProjectModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectAccessMiddleware)
      .forRoutes(
        { path: 'workspace/:workspace_uuid/project/:project_uuid/membership', method: RequestMethod.ALL },
        { path: 'workspace/:workspace_uuid/project/:project_uuid/members', method: RequestMethod.ALL },
        { path: 'workspace/:workspace_uuid/project/', method: RequestMethod.ALL },
        { path: 'workspace/:workspace_uuid/project/:project_uuid', method: RequestMethod.ALL },
      );
  }
}
