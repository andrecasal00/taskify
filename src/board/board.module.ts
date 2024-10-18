import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectAccessMiddleware } from 'src/project/project.middleware';
import { JwtService } from '@nestjs/jwt';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [BoardController],
  providers: [BoardService, JwtService],
  imports: [PrismaModule, SharedModule],
})
export class BoardModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectAccessMiddleware)
      .forRoutes(
        {
          path: 'workspace/:workspace_uuid/project/:project_uuid/board/',
          method: RequestMethod.ALL,
        },
        {
          path: 'workspace/:workspace_uuid/project/:project_uuid/board/:board_uuid',
          method: RequestMethod.ALL,
        },
      );
  }
}
