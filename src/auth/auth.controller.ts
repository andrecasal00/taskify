import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateAccountDto } from './dto/auth.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/shared/guards';
import { GetCurrentUserUuid } from 'src/shared/decorators/current-user-uuid.decorator';
import { GetCurrentUserCredentials } from 'src/shared/decorators/current-user-credentials.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Public()
    @Post("signin")
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() dto: AuthDto) {
        return this.authService.signIn(dto)
    }

    @Public()
    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() dto: CreateAccountDto) {
        return this.authService.signUp(dto)
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserUuid() userUuid: string) {
        console.log(userUuid)
        return this.authService.logout(userUuid);
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
      @GetCurrentUserUuid() userUuid: string, 
      @GetCurrentUserCredentials("refreshToken") refreshToken: string
    ) {
        console.log(refreshToken)
        return this.authService.refreshTokens(userUuid, refreshToken);
      }
}