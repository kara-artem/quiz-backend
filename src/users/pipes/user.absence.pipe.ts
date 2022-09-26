import { HttpStatus, Inject, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../users.service';
import { REQUEST } from '@nestjs/core';
import { ResponseException } from '../../common/exceptions/response.exception';
import { RequestPayloadInterface } from '../../common/interfaces/request.payload.interface';

export class IdAbsencePipe extends ValidationPipe {
  constructor(@Inject(REQUEST) public request: RequestPayloadInterface, private readonly usersService: UsersService) {
    super({
      transform: true,
    });
  }

  override async transform(id: string): Promise<string> {
    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new ResponseException(HttpStatus.NOT_FOUND, 'User is not exist.');
    }

    return id;
  }
}
