import { ForbiddenException, Injectable } from '@nestjs/common';
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

    const tokens = await this.generateTokens(user.uuid, user.email);
    await this.updateRefreshTokens(user.uuid, tokens.refresh_token);
    return tokens;
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
        bio: dto.bio
      },
    });

    const regularPermissionUuid = await this.getRegularUserPermission()

    // set user permission
    await this.prisma.userPermissions.create({
      data: {
        userUuid: newUser.uuid,
        permissionUuid: regularPermissionUuid
      }
    })

    // auto fill user integration
    await this.prisma.userIntegration.create({
      data: {
        userUuid: newUser.uuid,
      }
    })

    // auto fill user security settings
    await this.prisma.userSecuritySettings.create({
      data: {
        userUuid: newUser.uuid,
      }
    })

    // auto fill notification settings
    await this.prisma.userNotificationSettings.create({
      data: {
        userUuid: newUser.uuid,
      }
    })

    const tokens = await this.generateTokens(newUser.uuid, newUser.email);
    this.updateRefreshTokens(newUser.uuid, tokens.refresh_token);
  }

  async logout(credentialsUuid: string) {
   /* await this.prisma.users.update({
      where: {
        uuid: credentialsUuid,
        refreshTokenHash: {
          not: null,
        },
      },
      data: {
        refreshTokenHash: null,
      },
    });*/
  }

  // check if refresh token matches and generate new one
  async refreshTokens(credentialUuid: string, refreshToken: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        uuid: credentialUuid,
      },
    });

   /* const refreshTokenMatches = await argon.verify(
      user.refreshTokenHash,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }*/

    const tokens = await this.generateTokens(user.uuid, user.email);
    await this.updateRefreshTokens(user.uuid, tokens.refresh_token);
    return tokens;
  }

  // @method = to generate new user tokens
  // @parameters = information that I want to put in the token
  async generateTokens(credentialUuid: string, username: String) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          uuid: credentialUuid,
          username: username,
        },
        {
          expiresIn: 1 * 60,
          secret: jwtConstants.secretKey,
        },
      ),

      this.jwtService.signAsync(
        {
          uuid: credentialUuid,
          username: username,
        },
        {
          expiresIn: 24 * 7 * 60 * 60,
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
  async updateRefreshTokens(credentialsUuid: string, refreshToken: string) {
   /* const hashToken = await argon.hash(refreshToken);
    await this.prisma.users.update({
      where: {
        uuid: credentialsUuid,
      },
      data: {
        refreshTokenHash: hashToken,
      },
    });*/
  }




  async getRegularUserPermission() {
    const regularUser = await this.prisma.permissions.findFirst({
      where: {
        permission: "user"
      },
      select: {
        uuid: true
      }
    })

    return regularUser.uuid;
  }



}