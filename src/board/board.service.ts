import { ForbiddenException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardDto } from './dto/board.dto';
import { empty } from '@prisma/client/runtime/library';
import { UserValidations } from 'src/shared/utilities/user.validations';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService, private userValidations: UserValidations) { }

  async createBoard(dto: BoardDto, req: Request) {
    // everyone with access can create a board

    if (!req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const userUuid = req['project_access'].userUuid;

    console.log(`modMember?: ${(await this.userValidations.isModMember(userUuid)).valueOf()}`)

    if ((await this.userValidations.isModMember(userUuid)).valueOf() || req['project_access'].isOwner) {
      const board = await this.prisma.boards.create({
        data: {
          projectUuid: req['project_access'].projectUuid,
          name: dto.name,
          backgroundImage: dto.backgroundImage,
        },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: "Board created with success",
        data: board,
      };
    } else {
      throw new ForbiddenException(
        "You don't have permissions to create a new board!",
      );
    }
  }

  async getBoards(req: Request) {
    try {
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
        data: boards,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch boards due to an internal error',
      );
    }
  }

  async deleteBoard(boardUuid: string, req: Request) {
    // everyone with access can create a board

    if (!req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const userUuid = req['project_access'].userUuid;

    if ((await this.userValidations.isModMember(userUuid)).valueOf() || req['project_access'].isOwner) {
      await this.prisma.boards.deleteMany({
        where: {
          uuid: boardUuid
        }
      })
      return {
        statusCode: HttpStatus.OK,
        data: "Board deleted with success",
      };
    } else {
      throw new ForbiddenException(
        "You don't have permissions to delete a board!",
      );
    }
  }

  async updateBoard(boardUuid: string, req: Request, dto: BoardDto) {
    if (!req['project_access'].hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const userUuid = req['project_access'].userUuid;

    if ((await this.userValidations.isModMember(userUuid)).valueOf() || req['project_access'].isOwner) {
      await this.prisma.boards.update({
        where: {
          uuid: boardUuid
        },
        data: dto
      })
      return {
        statusCode: HttpStatus.OK,
        data: "Board updated with success",
      };
    } else {
      throw new ForbiddenException(
        "You don't have permissions to update this board!",
      );
    }
  }
}
