import { HttpStatus, Inject, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { ResponseException } from '../../common/exceptions/response.exception';
import { RegistrationDto } from '../dto/registration.dto';
import { RequestPayloadInterface } from '../../common/interfaces/request.payload.interface';
import { registrationStatus } from '../../users/enums/registration.status.enum';

export class RegistrationPipe extends ValidationPipe {
  constructor(@Inject(REQUEST) public request: RequestPayloadInterface, private readonly usersService: UsersService) {
    super({
      transform: true,
    });
  }

  override async transform(data: RegistrationDto): Promise<RegistrationDto> {
    const user = await this.usersService.findUserByEmail(data.email);

    if (user && user.registrationStatus === registrationStatus.ACTIVE) {
      throw new ResponseException(HttpStatus.CONFLICT, 'User already exists.');
    } else if (user) {
      await this.usersService.deleteUser(user.id);
    }

    return data;
  }
}
