import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';
import { EMPTY, NotFoundError } from 'rxjs';
import { permission } from 'process';
import { empty } from '@prisma/client/runtime/library';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(
    userUuid: string,
    workspaceUuid: string,
    dto: ProjectDto,
  ) {
    try {
      if (!userUuid) {
        throw new ForbiddenException();
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

  async getUserProjects(userUuid: string, workspaceUuid: string) {
    // get all my projects + the projects where I'm a member
    try {
      if (!userUuid) {
        throw new ForbiddenException();
      }

      // getting all the projects of user workspace where is owner
      const projects = await this.prisma.$queryRaw`
      SELECT tbl_projects.* FROM tbl_workspaces JOIN tbl_projects ON tbl_projects.workspace_uuid = tbl_workspaces.uuid WHERE tbl_workspaces.uuid=${workspaceUuid} 
      AND tbl_workspaces.owner_uuid = ${userUuid}`;

      /*
      const projectsMembership = await this.prisma
      .$queryRaw`SELECT tbl_projects.* FROM tbl_workspaces JOIN tbl_projects ON tbl_workspaces.uuid = tbl_projects.workspace_uuid 
      JOIN tbl_project_members ON tbl_project_members.project_uuid = tbl_projects.uuid WHERE tbl_project_members.user_uuid = ${userUuid} AND tbl_projects.workspace_uuid = ${workspaceUuid}`;
      */

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

  // assuming that we are inside of the project page
  async addMemberToProject(
    targetEmail: string,
    projectUuid: string,
    ownerUuid: string,
  ) {
    // searches if the email exists, if so adds to the project

    // check if i'm the owner of the current project
    const isProjectOwner = await this.isProjectOwner(ownerUuid, projectUuid);
    console.log(`is project owner: ${isProjectOwner}`)

    if (Object.keys(isProjectOwner).length === 0) {
      throw new ForbiddenException("You are not the owner of this project!")
    }

    // check if the user is valid

    const user = await this.prisma.users.findUnique({
      where: {
        email: targetEmail,
      },
      select: {
        uuid: true,
      },
    });

     // check if that member is not already in the project
     const isMemberInProject = await this.isMemberInProject(user.uuid, projectUuid);
     console.log(`isMemberInProject: ${isMemberInProject}`)
     if (Object.keys(isMemberInProject).length !== 0) {
       throw new ConflictException("The member you are trying to associate is already in the current project!")
     }

    if (!user) {
      throw new NotFoundException('Email not found');
    } else {
      const permission = await this.getMemberPermission();

      console.log(
        `rato uuid: ${user.uuid}\nproject uuid: ${projectUuid}\npermission: ${permission}`,
      );

      // add to project member
      const project = await this.prisma.projectMembers.create({
        data: {
          userUuid: user.uuid,
          projectUuid: projectUuid,
          permissionUuid: permission,
        },
      });

      return {
        status: HttpStatus.CREATED,
        data: [project],
      };
    }
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
        projectUuid: projectUuid
      }
    })
  }
}
