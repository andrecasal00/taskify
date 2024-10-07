import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';

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

      // get the projects where the user is a member of and not the owner
      const memberProjects = await this.prisma.$queryRaw`
       SELECT tbl_projects.* FROM tbl_projects JOIN tbl_project_members ON tbl_projects.uuid = tbl_project_members.project_uuid WHERE tbl_project_members.uuid= ${userUuid}`;

      return {
        status: HttpStatus.OK,
        ownerProjects: [projects],
        memberProjects: [memberProjects],
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
}
