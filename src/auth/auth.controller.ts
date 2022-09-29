import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { TokenValidationPipe } from './pipes/refresh.validation.pipe';
import { JwtRefreshTokenDto } from './dto/jwt.refresh.token.dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { RegistrationPipe } from './pipes/registration.pipe';
import { LoginSuccessDto } from './dto/login.success.dto';
import { StatusCode } from '../common/decorators/status.code.decorator';
import { StatusCodeResponseDto } from '../common/dto/status.code.response.dto';
import { LoginSuccessResponseDto } from './dto/login.success.response.dto';
import { RequestPayloadInterface } from '../common/interfaces/request.payload.interface';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('confirm-registration')
  @ApiQuery({ name: 'token', type: 'string' })
  @ApiOkResponse({ type: StatusCodeResponseDto })
  @StatusCode(HttpStatus.OK)
  async confirmRegister(@Query() { token }: { token: string }, @Res() res: Response): Promise<void> {
    const { confirmation } = await this.authService.confirmRegistration(token);
    confirmation
      ? res.redirect('https://quiz-freeze.site/login/?confirmation=success')
      : res.redirect('https://quiz-freeze.site/login/?confirmation=expired');
  }

  @Post('registration')
  @ApiOkResponse({ type: StatusCodeResponseDto })
  @StatusCode(HttpStatus.OK, 'Registration was successful')
  async registration(@Body(RegistrationPipe) data: RegistrationDto): Promise<void> {
    return this.authService.registration(data);
  }

  @Post('refresh')
  @ApiOkResponse({ type: LoginSuccessResponseDto })
  @StatusCode(HttpStatus.OK)
  async refresh(@Body(TokenValidationPipe) jwtRefreshTokenDto: JwtRefreshTokenDto): Promise<LoginSuccessDto | null> {
    return this.authService.refresh(jwtRefreshTokenDto.refreshToken);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginSuccessResponseDto })
  @StatusCode(HttpStatus.OK)
  async login(@Req() req: RequestPayloadInterface): Promise<LoginSuccessDto> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOkResponse({ type: StatusCodeResponseDto })
  @StatusCode(HttpStatus.OK, 'Logout successful')
  async logout(@Req() req: RequestPayloadInterface): Promise<void> {
    return this.authService.logout(req.user);
  }
}
