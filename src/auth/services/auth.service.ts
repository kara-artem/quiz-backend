import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { RegistrationDto } from '../dto/registration.dto';
import { JwtTokenService } from './jwt.token.service';
import { JwtService } from '@nestjs/jwt';
import { LoginSuccessDto } from '../dto/login.success.dto';
import * as bcrypt from 'bcrypt';
import { ResponseException } from '../../common/exceptions/response.exception';
import { UserPayloadInterface } from '../../users/interfaces/user.payload.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { MailService } from '../../mail/mail.service';
import { registrationStatus } from '../../users/enums/registration.status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtRefreshTokenService: JwtTokenService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserPayloadInterface> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new ResponseException(HttpStatus.NOT_FOUND, 'User is not exist.');
    }

    if (user.registrationStatus !== registrationStatus.ACTIVE) {
      throw new ResponseException(HttpStatus.NOT_FOUND, 'User not confirmed.');
    }

    const checkPassword = await bcrypt.compare(password, user.passwordHash);

    if (!checkPassword) {
      throw new ResponseException(HttpStatus.UNAUTHORIZED, 'Wrong password');
    }

    return { userId: user.id, email: user.email };
  }

  async registration(data: RegistrationDto): Promise<void> {
    const user = await this.usersService.createUser(data);
    await this.sendRegistrationMessage(user);
  }

  async sendRegistrationMessage(user: UserEntity): Promise<void> {
    const token = this.jwtService.sign(
      {
        userId: user.id,
      },
      { expiresIn: process.env.REGISTER_TOKEN_EXPIRES },
    );

    try {
      await this.usersService.saveRegisterToken(user.id, token);
      await this.mailService.sendUserConfirmation(user, token);
    } catch (e) {
      Logger.error(e, 'AuthService.sendRegistrationMessage');
      throw new ResponseException(HttpStatus.BAD_REQUEST, e instanceof Error ? e.message : '');
    }
  }

  async confirmRegistration(token: string): Promise<{ confirmation: string }> {
    try {
      const { userId } = await this.jwtService.verify(token);
      return this.usersService.confirmRegistration(userId);
    } catch {
      return { confirmation: 'expired' };
    }
  }

  async login(user: UserPayloadInterface): Promise<LoginSuccessDto> {
    const accessToken = this.jwtService.sign(user);
    const refreshToken = await this.jwtRefreshTokenService.add(user);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async logout(user: UserPayloadInterface): Promise<void> {
    const token = await this.jwtRefreshTokenService.findOneByUserId(user.userId);
    token && (await this.jwtRefreshTokenService.removeOne(token));
  }

  public async refresh(refreshToken: string): Promise<LoginSuccessDto | null> {
    const jwtRefreshToken = await this.jwtRefreshTokenService.findOne(refreshToken);
    return jwtRefreshToken && this.login({ userId: jwtRefreshToken.user.id, email: jwtRefreshToken.user.email });
  }
}
