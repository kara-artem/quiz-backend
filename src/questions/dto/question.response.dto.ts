import { HttpStatus } from '@nestjs/common';
import { QuestionEntity } from '../entities/question.entity';

export class QuestionResponseDto {
  statusCode: HttpStatus;
  message: Array<string>;
  data: QuestionEntity;
}
