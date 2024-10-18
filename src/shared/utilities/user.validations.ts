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
}