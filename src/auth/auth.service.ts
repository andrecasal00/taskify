import {
  BadGatewayException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, CreateAccountDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as argon from 'argon2';
import { jwtConstants } from 'src/shared/constants';
import { ConfigService } from '@nestjs/config';
import { Console } from 'console';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async signIn(dto: AuthDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user.uuid);
    await this.updateRefreshTokens(user.uuid, tokens.refresh_token);

    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      data: tokens,
    };
  }

  async signUp(dto: CreateAccountDto) {
    const prisma = this.prisma;
    var user = null;

    // Use Prisma transaction to handle multiple DB operations atomically
    await prisma.$transaction(async (tx) => {
      try {
        // Hash the password
        const hashedPassword = await this.hashPassword(dto.password);

        // Create new user
        const newUser = await tx.users.create({
          data: {
            email: dto.email,
            passwordHash: hashedPassword,
            name: dto.name,
            profilePicture: dto.profilePicture,
            phoneNumber: dto.phoneNumber,
            bio: dto.bio,
          },
        });

        const regularPermissionUuid = await this.getRegularUserPermission();

        // Create related entities concurrently where possible
        await Promise.all([
          tx.userPermissions.create({
            data: {
              userUuid: newUser.uuid,
              permissionUuid: regularPermissionUuid,
            },
          }),
          tx.userIntegration.create({
            data: { userUuid: newUser.uuid },
          }),
          tx.userSecuritySettings.create({
            data: { userUuid: newUser.uuid },
          }),
          tx.userNotificationSettings.create({
            data: { userUuid: newUser.uuid },
          }),
        ]);

        user = newUser;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Email already in use.');
          }
        }
        throw error;
      }
    });

    const tokens = await this.generateTokens(user.uuid);
    await this.updateRefreshTokens(user.uuid, tokens.refresh_token);

    return {
      status: HttpStatus.CREATED,
      data: {
        message: 'Account created successfully',
        tokens,
      },
    };
  }

  async logout(userUuid: string) {
    try {
      const token = await this.prisma.userTokens.updateMany({
        where: {
          userUuid: userUuid,
          refreshToken: {
            not: null,
          },
        },
        data: {
          refreshToken: null,
        },
      });

      if (token.count === 0) {
        throw new BadGatewayException(
          'User is already logged out or token not found.',
        );
      }

      return {
        status: HttpStatus.OK,
        message: 'Logout successful',
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadGatewayException(
          'User is already logged out or token not found.',
        );
      }

      throw error;
    }
  }

  async refreshTokens(userUuid: string, rt: string) {
    const user = await this.prisma.userTokens.findUnique({
      where: {
        userUuid: userUuid,
      },
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.refreshToken, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(user.userUuid);
    await this.updateRefreshTokens(user.userUuid, tokens.refresh_token);

    return tokens;
  }

  async generateTokens(credentialUuid: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          uuid: credentialUuid,
        },
        {
          expiresIn: '15m',
          secret: this.config.get<string>('AT_SECRET'),
        },
      ),

      this.jwtService.signAsync(
        {
          uuid: credentialUuid,
        },
        {
          expiresIn: '7d',
          secret: this.config.get<string>('RT_SECRET'),
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokens(userUuid: string, refreshToken: string) {
    const hashToken = await argon.hash(refreshToken);
    await this.prisma.userTokens.upsert({
      where: {
        userUuid: userUuid,
      },
      update: {
        refreshToken: hashToken,
      },
      create: {
        userUuid: userUuid,
        refreshToken: hashToken,
      },
    });
  }

  async getRegularUserPermission() {
    const regularUser = await this.prisma.permissions.findFirst({
      where: {
        permission: 'user',
      },
      select: {
        uuid: true,
      },
    });

    return regularUser.uuid;
  }
}
