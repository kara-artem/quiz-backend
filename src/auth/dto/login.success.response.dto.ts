import { LoginSuccessDto } from './login.success.dto';

export class LoginSuccessResponseDto {
  statusCode: number;
  message: Array<string>;
  data: LoginSuccessDto;
}
