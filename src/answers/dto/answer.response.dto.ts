import { HttpStatus } from '@nestjs/common';
import { AnswerEntity } from '../entities/answer.entity';

export class AnswerResponseDto {
  statusCode: HttpStatus;
  message: Array<string>;
  data: AnswerEntity;
}
