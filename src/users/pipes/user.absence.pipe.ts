import { HttpStatus, Inject, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../users.service';
import { REQUEST } from '@nestjs/core';
import { ResponseException } from '../../common/exceptions/response.exception';
import { UserPayloadInterface } from '../interfaces/user.payload.interface';

export class UserAbsencePipe extends ValidationPipe {
  constructor(@Inject(REQUEST) public request: any, private readonly usersService: UsersService) {
    super({
      transform: true,
    });
  }

  async transform(user: UserPayloadInterface) {
    const userData = await this.usersService.findUserById(user.userId);

    if (!userData) {
      throw new ResponseException(HttpStatus.NOT_FOUND, 'User is not exist.');
    }

    return user;
  }
}
