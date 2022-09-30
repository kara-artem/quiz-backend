import { QuizController } from '../common/decorators/quiz.controller.decorator';
import { Body, Get, HttpStatus, Post } from '@nestjs/common';
import { QuizSwaggerDecorator } from '../common/decorators/quiz.swagger.decorator';
import { StatusCode } from '../common/decorators/status.code.decorator';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create.answer.dto';
import { AnswerResponseDto } from './dto/answer.response.dto';
import { AnswerEntity } from './entities/answer.entity';
import { UserPayload } from '../users/decorators/user.payload.decorator';
import { UserPayloadInterface } from '../users/interfaces/user.payload.interface';
import { GetResultDto } from './dto/get.result.dto';
import { ResultResponseDto } from './dto/result.response.dto';
import { StatusCodeResponseDto } from '../common/dto/status.code.response.dto';

@QuizController('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Get('result')
  @QuizSwaggerDecorator('Get result', ResultResponseDto)
  @StatusCode(HttpStatus.OK)
  async getResult(@UserPayload() user: UserPayloadInterface): Promise<GetResultDto> {
    return this.answersService.getResult(user.userId);
  }

  @Post()
  @QuizSwaggerDecorator('Send answer', AnswerResponseDto)
  @StatusCode(HttpStatus.OK)
  async createAnswer(@Body() data: CreateAnswerDto, @UserPayload() user: UserPayloadInterface): Promise<AnswerEntity> {
    return this.answersService.createAnswer(data, user.userId);
  }

  @Post('result/reset')
  @QuizSwaggerDecorator('Reset result', StatusCodeResponseDto)
  @StatusCode(HttpStatus.OK, 'Results successfully reset')
  async resetResult(@UserPayload() user: UserPayloadInterface): Promise<void> {
    return this.answersService.resetResult(user.userId);
  }
}
