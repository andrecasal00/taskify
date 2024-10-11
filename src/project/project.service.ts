import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(workspaceUuid: string, dto: ProjectDto, req: Request) {
    try {
      if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
        throw new ForbiddenException('Access denied');
      }

      // get default private visibility
      const visibilityUuid = await this.getPrivateVisibility();

      const project = await this.prisma.projects.create({
        data: {
          workspaceUuid: workspaceUuid,
          visibilityUuid: visibilityUuid,
          name: dto.name,
          backgroundImage: dto.backgroundImage,
          description: dto.description,
        },
      });

      return { status: HttpStatus.CREATED, data: [project] };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch projects due to an internal error',
      );
    }
  }

  async getUserProjects(workspaceUuid: string, req: Request) {
    // get all my projects + the projects where I'm a member
    try {
      if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
        throw new ForbiddenException('Access denied');
      }

      // getting all the projects of user workspace where is owner
      const projects = await this.prisma.$queryRaw`
      SELECT tbl_projects.* FROM tbl_workspaces JOIN tbl_projects ON tbl_projects.workspace_uuid = tbl_workspaces.uuid WHERE tbl_workspaces.uuid=${workspaceUuid} 
      AND tbl_workspaces.owner_uuid = ${req['project_access'].userUuid}`;

      return {
        status: HttpStatus.OK,
        ownerProjects: [projects],
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch projects due to an internal error',
      );
    }
  }

  async deleteProject(projectUuid: string, req: Request) {
    /* const isProjectOwner = await this.isProjectOwner(userUuid, projectUuid);
    if (Object.keys(isProjectOwner).length === 0) {
      throw new ForbiddenException('You are not the owner of this project!');
    } */

    if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.projects.deleteMany({
      where: {
        uuid: projectUuid,
      },
    });

    return {
      status: HttpStatus.OK,
      message: 'The project was removed with success!',
    };
  }

  // assuming that we are inside of the project page
  async addMemberToProject(
    targetEmail: string,
    projectUuid: string,
    req: Request,
  ) {
    // Step 1: Validate if the current user is the owner of the project
    /* const isProjectOwner = await this.isProjectOwner(ownerUuid, projectUuid);
    if (Object.keys(isProjectOwner).length === 0) {
      throw new ForbiddenException('You are not the owner of this project!');
    } */

    console.log(req['project_access']);

    if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    // Step 2: Check if the user with the target email exists
    const user = await this.prisma.users.findUnique({
      where: { email: targetEmail },
      select: { uuid: true },
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    // Step 3: Check if the user is already a member of the project
    const isMemberInProject = await this.isMemberInProject(
      user.uuid,
      projectUuid,
    );
    if (isMemberInProject.length > 0) {
      throw new ConflictException(
        'The member you are trying to associate is already in the current project!',
      );
    }

    // Step 4: Get the user's permission
    const permissionUuid = await this.getMemberPermission();

    // Step 5: Add the user as a member to the project
    const projectMember = await this.prisma.projectMembers.create({
      data: {
        userUuid: user.uuid,
        projectUuid: projectUuid,
        permissionUuid: permissionUuid,
      },
    });

    // Step 6: Return success response
    return {
      status: HttpStatus.CREATED,
      message: 'The member was added with success!',
      data: [projectMember],
    };
  }

  async removeMemberFromProject(
    targetEmail: string,
    projectUuid: string,
    req: Request,
  ) {
    // Step 1: Validate if the current user is the owner of the project
    /* const isProjectOwner = await this.isProjectOwner(ownerUuid, projectUuid);
    if (Object.keys(isProjectOwner).length === 0) {
      throw new ForbiddenException('You are not the owner of this project!');
    } */

    if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    // Step 2: Check if the user with the target email exists
    const user = await this.prisma.users.findUnique({
      where: { email: targetEmail },
      select: { uuid: true },
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    // Step 3: Check if the user is already a member of the project
    const isMemberInProject = await this.isMemberInProject(
      user.uuid,
      projectUuid,
    );
    if (isMemberInProject.length > 0) {
      await this.prisma.projectMembers.deleteMany({
        where: {
          userUuid: user.uuid,
          projectUuid: projectUuid,
        },
      });
    } else {
      throw new ConflictException(
        'That email is not a member of your project!',
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'The member was removed with success!',
    };
  }

  async getPrivateVisibility() {
    const visibility = await this.prisma.projectVisibility.findFirst({
      where: {
        name: 'private',
      },
      select: {
        uuid: true,
      },
    });

    return visibility.uuid;
  }

  async getMemberPermission() {
    const permission = await this.prisma.projectPermissions.findFirst({
      where: {
        name: 'member',
      },
      select: {
        uuid: true,
      },
    });

    return permission.uuid;
  }

  async isProjectOwner(uuid: string, projectUuid: string) {
    return this.prisma.$queryRaw`
    SELECT * FROM tbl_workspaces JOIN tbl_projects ON tbl_workspaces.uuid = tbl_projects.workspace_uuid 
    WHERE tbl_workspaces.owner_uuid = ${uuid} AND tbl_projects.uuid = ${projectUuid}
    `;
  }

  async isMemberInProject(uuid: string, projectUuid: string) {
    return this.prisma.projectMembers.findMany({
      where: {
        userUuid: uuid,
        projectUuid: projectUuid,
      },
    });
  }
}
