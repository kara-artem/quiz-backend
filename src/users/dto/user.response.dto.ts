import { UserEntity } from '../entities/user.entity';
import { HttpStatus } from '@nestjs/common';

export class UserResponseDto {
  statusCode: HttpStatus;
  message: Array<string>;
  data: UserEntity;
}
