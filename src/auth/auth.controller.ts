import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TokenValidationPipe } from './pipes/refresh.validation.pipe';
import { JwtRefreshTokenDto } from './dto/jwt.refresh.token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegistrationPipe } from './pipes/registration.pipe';
import { StatusCode } from '../common/decorators/status.code.decorator';
import { StatusCodeResponseDto } from '../common/dto/status.code.response.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import { LoginDto } from './dto/login.dto';
import { LoginSuccessDto } from './dto/login.success.dto';
import { LoginSuccessResponseDto } from './dto/login.success.response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('confirm-registration')
  @ApiQuery({ name: 'token', type: 'string' })
  @ApiOkResponse({ type: StatusCodeResponseDto })
  @StatusCode(HttpStatus.OK)
  async confirmRegister(@Query() { token }): Promise<{ confirmation: string }> {
    return await this.authService.confirmRegistration(token);
  }

  @Post('registration')
  @ApiOkResponse({ type: StatusCodeResponseDto })
  @StatusCode(HttpStatus.OK, 'A link with registration confirmation has been sent to your email')
  async registration(@Body(RegistrationPipe) data: RegisterUserDto): Promise<void> {
    return await this.authService.registration(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOkResponse({ type: LoginSuccessResponseDto })
  @StatusCode(HttpStatus.OK)
  async refresh(@Body(TokenValidationPipe) jwtRefreshTokenDto: JwtRefreshTokenDto): Promise<LoginSuccessDto> {
    const { refreshToken } = jwtRefreshTokenDto;
    return this.authService.refresh(refreshToken);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginSuccessResponseDto })
  @StatusCode(HttpStatus.OK)
  async login(@Req() req): Promise<LoginSuccessDto> {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOkResponse({ type: StatusCodeResponseDto })
  @StatusCode(HttpStatus.OK, 'Logout successful')
  async logout(@Req() req): Promise<void> {
    return await this.authService.logout(req.user);
  }
}
