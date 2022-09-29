import { HttpStatus } from '@nestjs/common';
import { QuestionEntity } from '../entities/question.entity';

export class QuestionsResponseDto {
  statusCode: HttpStatus;
  message: Array<string>;
  data: QuestionEntity[];
}
