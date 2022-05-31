import { HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { JwtRefreshTokenService } from './jwt.refresh.token.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseException } from '../../common/exceptions/response.exception';
import * as bcrypt from 'bcrypt';
import { registrationStatus } from '../../users/enums/registration.status.enum';
import { MailService } from '../../mail/mail.service';
import { RegisterUserDto } from '../dto/register.user.dto';
import { LoginSuccessDto } from '../dto/login.success.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtRefreshTokenService: JwtRefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new ResponseException(HttpStatus.NOT_FOUND, 'User is not exist.');
    }

    if (user.registrationStatus !== registrationStatus.ACTIVE) {
      throw new ResponseException(HttpStatus.NOT_FOUND, 'User not confirmed.');
    }

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.passwordHash);

      if (user && checkPassword) {
        return user;
      }
    }

    throw new ResponseException(HttpStatus.NOT_FOUND, 'Wrong password.');
  }

  async registration(data: RegisterUserDto): Promise<void> {
    try {
      const user = await this.usersService.createUser(data);
      await this.sendRegistrationMessage(user);
    } catch (e) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }

  async sendRegistrationMessage(user: UserEntity) {
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
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }

  async confirmRegistration(token: string): Promise<{ confirmation: string }> {
    try {
      const { userId } = await this.jwtService.verify(token);

      return await this.usersService.confirmRegistration(userId);
    } catch {
      const res: any = await this.jwtService.decode(token);

      await this.usersService.saveRegisterToken(res.userId, null);

      return { confirmation: 'expired' };
    }
  }

  async login(user: UserEntity): Promise<LoginSuccessDto> {
    const payload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.jwtRefreshTokenService.add(user);

    return {
      ...payload,
      accessToken,
      refreshToken,
    };
  }

  async logout(user): Promise<void> {
    const token = await this.jwtRefreshTokenService.findOneByUserId(user.userId);
    await this.jwtRefreshTokenService.removeOne(token);
  }

  public async refresh(refreshToken): Promise<any> {
    const jwtRefreshToken = await this.jwtRefreshTokenService.findOne(refreshToken);

    return await this.login(jwtRefreshToken.user);
  }
}
