import { HttpStatus, Inject, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { ResponseException } from '../../common/exceptions/response.exception';
import { registrationStatus } from '../../users/enums/registration.status.enum';

export class RegistrationPipe extends ValidationPipe {
  constructor(@Inject(REQUEST) public request: any, private readonly usersService: UsersService) {
    super({
      transform: true,
    });
  }

  async transform(data) {
    const user = await this.usersService.findUserById(data.id);

    if (user && user.registrationStatus === registrationStatus.ACTIVE) {
      throw new ResponseException(HttpStatus.CONFLICT, 'User already exists.');
    } else if (user) {
      await this.usersService.deleteUser(user.id);
    }

    return data;
  }
}
