import { ExecutionContext, ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCurrentUserUuid } from 'src/shared/decorators/current-user-uuid.decorator';

@Injectable()
export class ProjectAccessMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userUuid = GetCurrentUserUuid().toString(); //req.user["uuid"]; // Assuming you've set user from JWT or session
    const { workspace_uuid, project_uuid } = req.params;

    const request = req.headers = {
      ...req.headers,
      Authorization: req.headers.Authorization || '',
    };

    console.log(`request header: ${request.authorization.replace('Bearer ', '')}`)


    console.log(`middleware: workspace uuid: ${workspace_uuid}\nproject uuid: ${project_uuid}`)
    console.log(userUuid)

    // Check if the user is the owner of the workspace
    const workspace = await this.prisma.workspaces.findUnique({
      where: { uuid: workspace_uuid },
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace not found.');
    }

    console.log(`owner uuid: ${workspace.ownerUuid} - user uuid: ${userUuid}`)

    // Check if the user is the owner of the workspace
    if (workspace.ownerUuid === userUuid) {
        console.log("I'm entering here.")

      // User is the owner, grant access
      req["project_access"] = { isOwner: true, hasAccess: true };
      return next();
    } 

    console.log("Setting project_access:", req["project_access"]);


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
    req["project_access"] = { isOwner: false, hasAccess: true };
    return next();
  }
}