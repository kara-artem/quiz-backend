import { QuestionEntity } from '../entities/question.entity';

export class QuestionsResponseDto {
  statusCode: number;
  message: Array<string>;
  data: QuestionEntity[];
}
