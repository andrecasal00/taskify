import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, CreateAccountDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as argon from 'argon2';
import { jwtConstants } from 'src/shared/constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
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
      data: [tokens],
    };
  }

  async signUp(dto: CreateAccountDto) {
    const hashedPassword = await this.hashPassword(dto.password);

    // create new user
    const newUser = await this.prisma.users.create({
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

    // set user permission
    await this.prisma.userPermissions.create({
      data: {
        userUuid: newUser.uuid,
        permissionUuid: regularPermissionUuid,
      },
    });

    // auto fill user integration
    await this.prisma.userIntegration.create({
      data: {
        userUuid: newUser.uuid,
      },
    });

    // auto fill user security settings
    await this.prisma.userSecuritySettings.create({
      data: {
        userUuid: newUser.uuid,
      },
    });

    // auto fill notification settings
    await this.prisma.userNotificationSettings.create({
      data: {
        userUuid: newUser.uuid,
      },
    });

    const tokens = await this.generateTokens(newUser.uuid);
    this.updateRefreshTokens(newUser.uuid, tokens.refresh_token);
    return {
      status: HttpStatus.CREATED,
      data: 'success',
    };
  }

  async logout(userUuid: string) {
    const token = await this.prisma.userTokens.update({
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

    return {
      status: HttpStatus.OK,
      data: token,
    };
  }

  async refreshTokens(userUuid: string, rt: string) {
    const user = await this.prisma.userTokens.findUnique({
      where: {
        userUuid: userUuid,
      },
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('1- Access Denied');

    const rtMatches = await argon.verify(user.refreshToken, rt);
    if (!rtMatches) throw new ForbiddenException('2- Access Denied');

    const tokens = await this.generateTokens(user.userUuid);
    await this.updateRefreshTokens(user.userUuid, tokens.refresh_token);

    return tokens;
  }

  // @method = to generate new user tokens
  // @parameters = information that I want to put in the token
  async generateTokens(credentialUuid: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          uuid: credentialUuid,
        },
        {
          expiresIn: '15m',
          secret: jwtConstants.secretKey,
        },
      ),

      this.jwtService.signAsync(
        {
          uuid: credentialUuid,
        },
        {
          expiresIn: '7d',
          secret: jwtConstants.secretKey,
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // update the refresh token of a user in the database
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
