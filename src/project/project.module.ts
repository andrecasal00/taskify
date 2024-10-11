import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectAccessMiddleware } from './project.middleware';

@Module({
  providers: [ProjectService],
  controllers: [ProjectController],
  imports: [PrismaModule]
})
export class ProjectModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectAccessMiddleware)
      .forRoutes(
        { path: 'workspace/:workspace_uuid/project/', method: RequestMethod.ALL },
      );
  }
}
