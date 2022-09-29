import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { TokenValidationPipe } from './pipes/refresh.validation.pipe';
import { JwtRefreshTokenDto } from './dto/jwt.refresh.token.dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { RegistrationPipe } from './pipes/registration.pipe';
import { LoginSuccessDto } from './dto/login.success.dto';
import { StatusCode } from '../common/decorators/status.code.decorator';
import { StatusCodeResponseDto } from '../common/dto/status.code.response.dto';
import { LoginSuccessResponseDto } from './dto/login.success.response.dto';
import { RequestPayloadInterface } from '../common/interfaces/request.payload.interface';
import { Response } from 'express';
import { QuizSwaggerDecorator } from '../common/decorators/quiz.swagger.decorator';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('confirm-registration')
  @QuizSwaggerDecorator('Confirm registration', StatusCodeResponseDto, {
    apiQueryOptions: {
      name: 'token',
      type: 'string',
    },
  })
  @StatusCode(HttpStatus.OK)
  async confirmRegister(@Query() { token }: { token: string }, @Res() res: Response): Promise<void> {
    const { confirmation } = await this.authService.confirmRegistration(token);
    confirmation
      ? res.redirect('https://quiz-freeze.site/login/?confirmation=success')
      : res.redirect('https://quiz-freeze.site/login/?confirmation=expired');
  }

  @Post('registration')
  @QuizSwaggerDecorator('User registration', StatusCodeResponseDto)
  @StatusCode(HttpStatus.OK, 'Registration was successful')
  async registration(@Body(RegistrationPipe) data: RegistrationDto): Promise<void> {
    return this.authService.registration(data);
  }

  @Post('refresh')
  @QuizSwaggerDecorator('Refresh access token by refresh token', LoginSuccessResponseDto)
  @StatusCode(HttpStatus.OK)
  async refresh(@Body(TokenValidationPipe) jwtRefreshTokenDto: JwtRefreshTokenDto): Promise<LoginSuccessDto | null> {
    return this.authService.refresh(jwtRefreshTokenDto.refreshToken);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @QuizSwaggerDecorator('User authorization', LoginSuccessResponseDto, {
    apiBodyOptions: { type: LoginDto },
  })
  @StatusCode(HttpStatus.OK)
  async login(@Req() req: RequestPayloadInterface): Promise<LoginSuccessDto> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @QuizSwaggerDecorator('User logout', StatusCodeResponseDto)
  @StatusCode(HttpStatus.OK, 'Logout successful')
  async logout(@Req() req: RequestPayloadInterface): Promise<void> {
    return this.authService.logout(req.user);
  }
}
