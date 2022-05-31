import { UserEntity } from '../entities/user.entity';

export class UserResponseDto {
  statusCode: number;
  message: Array<string>;
  data: UserEntity;
}
