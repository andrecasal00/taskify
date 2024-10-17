import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkspaceDto } from './dto/workspace.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) { }

  validateUser(userUuid: string) {
    if (!userUuid) {
      throw new ForbiddenException('User not authenticated');
    }
  }

  async createWorkspace(ownerUuid: string, dto: WorkspaceDto) {
    this.validateUser(ownerUuid);

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

      return { statusCode: HttpStatus.CREATED, data: workspace };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Handle known Prisma errors if needed
      }
      throw new InternalServerErrorException('Failed to create workspace.');
    }
  }

  async getUserWorkspaces(userUuid: string) {
    this.validateUser(userUuid);

    try {
      const workspaces = await this.prisma.workspaces.findMany({
        where: {
          ownerUuid: userUuid,
          deletedAt: null,
        },
      });

      // Fetch shared workspaces via raw query
      const sharedWorkspaces = await this.prisma.$queryRaw`
        SELECT tbl_workspaces.uuid, tbl_workspaces.name 
        FROM tbl_workspaces 
        JOIN tbl_projects ON tbl_workspaces.uuid = tbl_projects.workspace_uuid
        JOIN tbl_project_members ON tbl_project_members.project_uuid = tbl_projects.uuid 
        WHERE tbl_project_members.user_uuid = ${userUuid}
      `;

      return {
        statusCode: HttpStatus.OK,
        data: {
          workspaces,
          sharedWorkspaces,
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch workspaces.');
    }
  }

  async deleteWorkspace(userUuid: string, workspaceUuid: string) {
    this.validateUser(userUuid);

    try {
      // Step 1: Verify ownership of workspace
      const isOwner = await this.isWorkspaceOwner(userUuid, workspaceUuid);
      if (!isOwner) {
        throw new ForbiddenException('You are not the owner of this workspace!');
      }

      // Step 2: Delete workspace
      await this.prisma.workspaces.delete({
        where: { uuid: workspaceUuid },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Workspace was deleted successfully!',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Workspace not found or already deleted.');
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to delete workspace.');
    }
  }

  // Check if user is the owner of the workspace
  async isWorkspaceOwner(userUuid: string, workspaceUuid: string) {
    const workspace = await this.prisma.workspaces.findFirst({
      where: {
        uuid: workspaceUuid,
        ownerUuid: userUuid,
      },
    });

    return workspace !== null; // Return true if workspace exists
  }
}
