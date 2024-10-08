import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkspaceDto } from './dto/workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async createWorkspace(ownerUuid: string, dto: WorkspaceDto) {
    try {
      if (!ownerUuid) {
        throw new ForbiddenException();
      }

      const workspace = await this.prisma.workspaces.create({
        data: {
          ownerUuid: ownerUuid,
          name: dto.name,
          description: dto.description,
          backgroundImage: dto.backgroundImage,
        },
      });

      return { status: HttpStatus.CREATED, data: [workspace] };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch projects due to an internal error',
      );
    }
  }

  async getUserWorkspaces(userUuid: string) {
    try {
      if (!userUuid) {
        throw new ForbiddenException();
      }

      const workspaces = await this.prisma.workspaces.findMany({
        where: {
          ownerUuid: userUuid,
          deletedAt: null,
        },
      });

      const sharedWorkspaces = await this.prisma
        .$queryRaw`SELECT tbl_workspaces.uuid, tbl_workspaces.name FROM tbl_workspaces JOIN tbl_projects ON tbl_workspaces.uuid = tbl_projects.workspace_uuid 
          JOIN tbl_project_members ON tbl_project_members.project_uuid = tbl_projects.uuid WHERE tbl_project_members.user_uuid = ${userUuid}`;

      return {
        status: HttpStatus.OK,
        workspaces: [workspaces],
        sharedWorkspaces: [sharedWorkspaces],
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      console.log(error);

      throw new InternalServerErrorException(
        'Failed to fetch projects due to an internal error',
      );
    }
  }

  async deleteWorkpace(userUuid: string, workspaceUuid: string) {
    try {
      if (!userUuid) {
        throw new ForbiddenException();
      }

      // Step 1: verify if this user is the owner of the workspace
      const isWorkspaceOwner = await this.isWorkspaceOwner(
        userUuid,
        workspaceUuid,
      );
      if (Object.keys(isWorkspaceOwner).length === 0) {
        throw new ForbiddenException(
          'You are not the owner of this workspace!',
        );
      }

      await this.prisma.workspaces.delete({
        where: {
          uuid: workspaceUuid
        }
      })

      return {
        status: HttpStatus.OK,
        message: 'Workspace was deleted successfuly!',
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      console.log(error)

      throw new InternalServerErrorException(
        'Failed to fetch projects due to an internal error',
      );
    }
  }

  async isWorkspaceOwner(userUuid: string, workspaceUuid: string) {
    return this.prisma.workspaces.findMany({
      where: {
        uuid: workspaceUuid,
        ownerUuid: userUuid,
      },
    });
  }
}
