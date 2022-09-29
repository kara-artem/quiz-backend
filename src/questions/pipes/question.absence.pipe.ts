import { HttpStatus, Inject, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ResponseException } from '../../common/exceptions/response.exception';
import { RequestPayloadInterface } from '../../common/interfaces/request.payload.interface';
import { QuestionsService } from '../services/questions.service';

export class QuestionAbsencePipe extends ValidationPipe {
  constructor(
    @Inject(REQUEST) public request: RequestPayloadInterface,
    private readonly questionsService: QuestionsService,
  ) {
    super({
      transform: true,
    });
  }

  override async transform(id: string): Promise<string> {
    const question = await this.questionsService.getQuestionById(id);

    if (!question) {
      throw new ResponseException(HttpStatus.NOT_FOUND, 'Question not found.');
    }

    return id;
  }
}
