import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProjectAccessMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const { workspace_uuid, project_uuid } = req.params;

    const token = this.extractTokenFromHeader(req); // Assuming you've set user from JWT or session

    const decodedToken = this.jwtService.decode(token);
    const userUuid = decodedToken.uuid;

    // Check if the user is the owner of the workspace
    const workspace = await this.prisma.workspaces.findUnique({
      where: { uuid: workspace_uuid },
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace not found.');
    }

    // Check if the user is the owner of the workspace
    if (workspace.ownerUuid === userUuid) {
      // User is the owner, grant access
      req['project_access'] = { isOwner: true, hasAccess: true, userUuid: userUuid, projectUuid: project_uuid, workspaceUuid: workspace_uuid };
      return next();
    }

    // Check if the user is a member of the project
    const projectMember = await this.prisma.projectMembers.findFirst({
      where: {
        projectUuid: project_uuid,
        userUuid: userUuid,
      },
    });

    if (!projectMember) {
      throw new ForbiddenException('Access denied to this project.');
    }

    // User is a project member, grant access
    req['project_access'] = { isOwner: false, hasAccess: true, userUuid: userUuid, projectUuid: project_uuid, workspaceUuid: workspace_uuid };
    return next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
