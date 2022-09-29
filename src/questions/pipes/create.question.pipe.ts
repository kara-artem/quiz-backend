import { HttpStatus, Inject, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ResponseException } from '../../common/exceptions/response.exception';
import { RequestPayloadInterface } from '../../common/interfaces/request.payload.interface';
import { QuestionsService } from '../services/questions.service';
import { CreateQuestionDto } from '../dto/create.question.dto';

export class CreateQuestionPipe extends ValidationPipe {
  constructor(
    @Inject(REQUEST) public request: RequestPayloadInterface,
    private readonly questionsService: QuestionsService,
  ) {
    super({
      transform: true,
    });
  }

  override async transform(data: CreateQuestionDto): Promise<CreateQuestionDto> {
    const question = await this.questionsService.getQuestionByOrderNumber(data.orderNumber);

    if (question) {
      throw new ResponseException(HttpStatus.CONFLICT, 'Question with this order number already exist.');
    }

    return data;
  }
}
