import { ForbiddenException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
    constructor(private prisma: PrismaService) {}

    async createProject(userUuid: string, workspaceUuid: string, dto: ProjectDto) {
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
                description: dto.description
              }
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

    async getUserProjects(userUuid: string) {
        // get all my projects + the projects where I'm a member
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
