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
import { UserValidations } from 'src/shared/utilities/user.validations';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService, private userValidations: UserValidations) { }

  async createProject(dto: ProjectDto, req: Request) {
    try {
      if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
        throw new ForbiddenException('Access denied');
      }

      if (req['project_access'].isOwner) {
        // get default private visibility
        const visibilityUuid = await this.getPrivateVisibility();

        const project = await this.prisma.projects.create({
          data: {
            workspaceUuid: req['project_access'].workspaceUuid,
            visibilityUuid: visibilityUuid,
            name: dto.name,
            backgroundImage: dto.backgroundImage,
            description: dto.description,
          },
        });
        return { statusCode: HttpStatus.CREATED, data: project };
      } else {
        throw new ForbiddenException("You don't have permissions to create a project in this workspace.");
      }      
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch projects due to an internal error',
      );
    }
  }

  async getUserProjects(req: Request) {
    // get all my projects + the projects where I'm a member
    try {
      if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
        throw new ForbiddenException('Access denied');
      }

      console.log(`getUserProjects: workspace_uuid: ${req['project_access'].workspaceUuid}`)

      // getting all the projects of user workspace where is owner
      const projects = await this.prisma.$queryRaw`
      SELECT tbl_projects.* FROM tbl_workspaces JOIN tbl_projects ON tbl_projects.workspace_uuid = tbl_workspaces.uuid WHERE tbl_workspaces.uuid=${req['project_access'].workspaceUuid} 
      AND tbl_workspaces.owner_uuid = ${req['project_access'].userUuid}`;

      const memberProjects = await this.prisma.$queryRaw`
      SELECT tbl_projects.* 
      FROM tbl_project_members 
      JOIN tbl_projects ON tbl_project_members.project_uuid = tbl_projects.uuid
      JOIN tbl_workspaces ON tbl_projects.workspace_uuid = tbl_workspaces.uuid
      WHERE tbl_workspaces.uuid = ${req['project_access'].workspaceUuid}
      AND tbl_project_members.user_uuid = ${req['project_access'].userUuid}`;

      return {
        statusCode: HttpStatus.OK,
        ownerProjects: projects,
        sharedProjects: memberProjects
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

  async deleteProject(req: Request) {
    if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.projects.deleteMany({
      where: {
        uuid: req['project_access'].projectUuid,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'The project was removed with success!',
    };
  }

  async updateProject(dto: ProjectDto, req: Request) {
    try {
      if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
        throw new ForbiddenException('Access denied');
      }
      
      if (req['project_access'].isOwner) {
        const visibilityUuid = await this.getPrivateVisibility();
        
        const project = await this.prisma.projects.update({
          where: {
            uuid: req['project_access'].projectUuid,
          },
          data: {
            visibilityUuid: visibilityUuid,
            name: dto.name,
            backgroundImage: dto.backgroundImage,
            description: dto.description,
          }
        })
        return { statusCode: HttpStatus.OK, data: project };
      } else {
        throw new ForbiddenException("You don't have permissions to create a project in this workspace.");
      }
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      console.log(error)
      throw new InternalServerErrorException(
        'Failed to patch the project due to an internal error',
      );
    }
  }

  // assuming that we are inside of the project page
  async addMemberToProject(
    targetEmail: string,
    req: Request,
  ) {

    // Step 1: Validate if the current user is the owner of the project or has access
    if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    // Step 2: Check if the user has permissions to add a member (owner or mod)
    if (req['project_access'].isOwner || await this.userValidations.isModMember(req['project_access'].userUuid).valueOf()) {
      // Step 3: Check if the user with the target email exists
      const user = await this.prisma.users.findUnique({
        where: { email: targetEmail },
        select: { uuid: true },
      });

      if (!user) {
        throw new NotFoundException('Email not found');
      }

      if (await this.userValidations.isOwnerEmail(targetEmail, req['project_access'].projectUuid)) {
        throw new ConflictException('You cannot add the owner of this project!');
      }

      // Step 4: Check if the user is already a member of the project
      const isMemberInProject = await this.userValidations.isMemberInProject(
        user.uuid,
        req['project_access'].projectUuid,
      );
      if (isMemberInProject.length > 0) {
        throw new ConflictException(
          'The member you are trying to associate is already in the current project!',
        );
      }

      // Step 5: Get the user's permission
      const permissionUuid = await this.userValidations.getMemberPermission();

      // Step 6: Add the user as a member to the project
      const projectMember = await this.prisma.projectMembers.create({
        data: {
          userUuid: user.uuid,
          projectUuid: req['project_access'].projectUuid,
          permissionUuid: permissionUuid,
        },
      });

      // Step 7: Return success response
      return {
        statusCode: HttpStatus.CREATED,
        message: 'The member was added with success!',
        data: projectMember,
      };
    } else {
      throw new ForbiddenException("You don't have permissions to add a member.")
    }
  }

  async removeMemberFromProject(
    targetEmail: string,
    req: Request,
  ) {
    // Step 1: Validate if the current user is the owner of the project or has access
    if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    // Step 2: Check if the user has permissions to remove a member (owner or mod)
    if (req['project_access'].isOwner || await this.userValidations.isModMember(req['project_access'].userUuid).valueOf()) {
      // Step 2: Check if the user with the target email exists
      const user = await this.prisma.users.findUnique({
        where: { email: targetEmail },
        select: { uuid: true },
      });

      if (!user) {
        throw new NotFoundException('Email not found');
      }

      if (await this.userValidations.isOwnerEmail(targetEmail, req['project_access'].projectUuid)) {
        throw new ConflictException('You cannot remove the owner of this project!');
      }

      // Step 3: Check if the user is already a member of the project
      const isMemberInProject = await this.userValidations.isMemberInProject(
        user.uuid,
        req['project_access'].projectUuid,
      );
      if (isMemberInProject.length > 0) {
        await this.prisma.projectMembers.deleteMany({
          where: {
            userUuid: user.uuid,
            projectUuid: req['project_access'].projectUuid,
          },
        });
      } else {
        throw new ConflictException(
          'That email is not a member of your project!',
        );
      }
    } else {
      throw new ForbiddenException("You don't have permissions to remove a member.")
    }

    return {
      statusCode: HttpStatus.OK,
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

  async getProjectMembers(
    req: Request,
  ) {

    // Step 1: Validate if the current user is the owner of the project or has access
    if (!req['project_access'].isOwner && !req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const members = await this.prisma.projectMembers.findMany({
      where: {
        projectUuid: req['project_access'].projectUuid
      },
      include: {
        users: {
          select: {
            name: true,
            email: true
          },
        },
      }
    })

    return {
      statusCode: HttpStatus.OK,
      data: members,
    };
  }
}