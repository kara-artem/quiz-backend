import { LoginSuccessDto } from './login.success.dto';
import { HttpStatus } from '@nestjs/common';

export class LoginSuccessResponseDto {
  statusCode: HttpStatus;
  message: Array<string>;
  data: LoginSuccessDto;
}
