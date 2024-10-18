import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardDto } from './dto/board.dto';
import { empty } from '@prisma/client/runtime/library';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async createBoard(dto: BoardDto, req: Request) {
    // everyone with access can create a board

    if (!req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const userUuid = req['project_access'].userUuid;

    const userPermission = await this.checkUserPermission(
      userUuid,
      req['project_access'].projectUuid,
    );

    if (userPermission === 'mod' || !req['project_access'].isOwner) {
      const board = await this.prisma.boards.create({
        data: {
          projectUuid: req['project_access'].projectUuid,
          name: dto.name,
          backgroundImage: dto.backgroundImage,
        },
      });
      return {
        statusCode: HttpStatus.CREATED,
        data: [board],
      };
    } else {
      throw new ForbiddenException(
        "You don't have permissions to create a new board!",
      );
    }
  }

  async getBoards(req: Request) {
    if (!req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const boards = await this.prisma.boards.findMany({
      where: {
        projectUuid: req['project_access'].projectUuid
      }
    });
    return {
      statusCode: HttpStatus.OK,
      data: [boards],
    };
  }

  async deleteBoard(boardUuid: string, req: Request) {
    // everyone with access can create a board

    if (!req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const userUuid = req['project_access'].userUuid;

    const userPermission = await this.checkUserPermission(
      userUuid,
      req['project_access'].projectUuid,
    );

    if (userPermission === 'mod') {
      await this.prisma.boards.deleteMany({
        where: {
          uuid: boardUuid
        }
      })
      return {
        statusCode: HttpStatus.OK,
        data: "Board was deleted with success.",
      };
    } else {
      throw new ForbiddenException(
        "You don't have permissions to delete a board!",
      );
    }
  }

  async checkUserPermission(userUuid: string, projectUuid: string) {
    const userPermission = await this.prisma.projectMembers.findFirst({
      where: {
        projectUuid: projectUuid,
        userUuid: userUuid,
      },
      select: {
        permissionUuid: true,
      },
    });

    console.log(`user permission: ${userPermission.permissionUuid}`);

    const permissions = await this.prisma.projectPermissions.findFirst({
      where: {
        uuid: userPermission.permissionUuid,
      },
      select: {
        name: true,
      },
    });

    console.log(`permission name: ${permissions.name}`);

    return permissions.name;
  }
}
