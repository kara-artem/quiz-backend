import { HttpStatus } from '@nestjs/common';
import { GetResultDto } from './get.result.dto';

export class ResultResponseDto {
  statusCode: HttpStatus;
  message: Array<string>;
  data: GetResultDto;
}
