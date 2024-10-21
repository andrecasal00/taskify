import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateAccountDto } from './dto/auth.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/shared/guards';
import { GetCurrentUserUuid } from 'src/shared/decorators/current-user-uuid.decorator';
import { GetCurrentUserCredentials } from 'src/shared/decorators/current-user-credentials.decorator';
import { ApiBadGatewayResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'logs in into the user account'})
  @ApiOkResponse({description: 'login successful'})
  @ApiForbiddenResponse({description: 'invalid credentials'})
  async signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: 'creates a new user account'})
  @ApiCreatedResponse({description: 'user account created with success'})
  @ApiForbiddenResponse({description: 'invalid credentials'})
  async signUp(@Body() dto: CreateAccountDto) {
    return this.authService.signUp(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'logout from user account'})
  @ApiOkResponse({description: 'logout made with success'})
  @ApiBadGatewayResponse({description: 'user already did a logout'})
  logout(@GetCurrentUserUuid() userUuid: string) {
    console.log(userUuid);
    return this.authService.logout(userUuid);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'refresh user tokens'})
  @ApiOkResponse({description: 'tokens updated with success'})
  @ApiForbiddenResponse({description: 'access denied'})
  refreshTokens(
    @GetCurrentUserUuid() userUuid: string,
    @GetCurrentUserCredentials('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userUuid, refreshToken);
  }
}
