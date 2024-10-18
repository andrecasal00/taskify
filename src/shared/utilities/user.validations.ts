import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserValidations {
    constructor(private prisma: PrismaService) { }

    async isModMember(userUuid: string) {
        const permissionUuid = await this.getModPermission();
        const hasPermissions = await this.prisma.projectMembers.findFirst({
            where: {
                userUuid: userUuid,
                permissionUuid: permissionUuid
            }
        })
        console.log(hasPermissions)
        return hasPermissions !== null;
    }

    async getModPermission() {
        const permission = await this.prisma.projectPermissions.findFirst({
            where: {
                name: 'mod',
            },
            select: {
                uuid: true,
            },
        });

        return permission.uuid;
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

    async getGuestPermission() {
        const permission = await this.prisma.projectPermissions.findFirst({
            where: {
                name: 'guest',
            },
            select: {
                uuid: true,
            },
        });

        return permission.uuid;
    }

    async isNotGuestMember(userUuid: string) {
        const permissionUuid = await this.getGuestPermission();
        const hasPermissions = await this.prisma.projectMembers.findFirst({
            where: {
                userUuid: userUuid,
                permissionUuid: {
                    not: permissionUuid
                }
            }
        })
        console.log(hasPermissions)
        return hasPermissions !== null;
    }

    async isOwnerEmail(email: string, projectUuid: string): Promise<boolean> {
        console.log(`target email: ${email}`)

        // Step 1: Get the UUID of the user by their email
        const user = await this.prisma.users.findFirst({
            where: { email: email },
            select: { uuid: true }, // Only select the UUID
        });

        // If no user is found by email, return false
        if (!user) {
            return false;
        }

        const userUuid = user.uuid;

        // Step 2: Check if the user is the owner of any workspace or project
        const isOwner = await this.prisma.$queryRaw`
          SELECT tbl_workspaces.uuid FROM tbl_workspaces 
          JOIN tbl_projects ON tbl_workspaces.uuid = tbl_projects.workspace_uuid 
          WHERE tbl_workspaces.owner_uuid = ${userUuid} AND tbl_projects.uuid = ${projectUuid}`;

        console.log(Array.isArray(isOwner) && isOwner.length > 0)
        // Step 3: Return true if the query returns any result, false otherwise
        return Array.isArray(isOwner) && isOwner.length > 0;
    }

    async isMemberInProject(uuid: string, projectUuid: string) {
        return this.prisma.projectMembers.findMany({
            where: {
                userUuid: uuid,
                projectUuid: projectUuid,
            },
        });
    }

    async isMemberInTask(uuid: string, taskUuid: string) {
        return this.prisma.taskMembers.findMany({
            where: {
                associatedToUuid: uuid,
                taksUuid: taskUuid,
            },
        });
    }
}