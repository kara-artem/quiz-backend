import { QuizController } from '../common/decorators/quiz.controller.decorator';
import { QuestionsService } from './services/questions.service';
import { Body, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { StatusCode } from '../common/decorators/status.code.decorator';
import { QuestionEntity } from './entities/question.entity';
import { QuestionResponseDto } from './dto/question.response.dto';
import { CreateOptionsDto } from './dto/create.options.dto';
import { OptionEntity } from './entities/option.entity';
import { OptionsResponseDto } from './dto/options.response.dto';
import { CreateQuestionDto } from './dto/create.question.dto';
import { StatusCodeResponseDto } from '../common/dto/status.code.response.dto';
import { QuestionAbsencePipe } from './pipes/question.absence.pipe';
import { OptionsService } from './services/options.service';
import { OptionAbsencePipe } from './pipes/option.absence.pipe';
import { QuizSwaggerDecorator } from '../common/decorators/quiz.swagger.decorator';
import { QuestionsResponseDto } from './dto/questions.response.dto';
import { CreateQuestionPipe } from './pipes/create.question.pipe';

@QuizController('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService, private readonly optionsService: OptionsService) {}

  @Get()
  @QuizSwaggerDecorator('Getting all the questions', QuestionsResponseDto)
  @StatusCode(HttpStatus.OK)
  async getQuestions(): Promise<QuestionEntity[] | null> {
    return this.questionsService.getQuestions();
  }

  @Post()
  @QuizSwaggerDecorator('Create question', QuestionResponseDto)
  @StatusCode(HttpStatus.CREATED)
  async createQuestion(@Body(CreateQuestionPipe) data: CreateQuestionDto): Promise<QuestionEntity> {
    return this.questionsService.createQuestion(data);
  }

  @Post('options')
  @QuizSwaggerDecorator('Create options', OptionsResponseDto)
  @StatusCode(HttpStatus.CREATED)
  async createOptions(@Body() data: CreateOptionsDto): Promise<OptionEntity[]> {
    return this.optionsService.createOptions(data);
  }

  @Delete(':id')
  @QuizSwaggerDecorator('Delete question', StatusCodeResponseDto)
  @StatusCode(HttpStatus.OK, 'Data successfully deleted')
  async deleteQuestion(@Param('id', ParseUUIDPipe, QuestionAbsencePipe) id: string): Promise<void> {
    return this.questionsService.deleteQuestion(id);
  }

  @Delete('option/:id')
  @QuizSwaggerDecorator('Delete Option', StatusCodeResponseDto)
  @StatusCode(HttpStatus.OK, 'Data successfully deleted')
  async deleteOption(@Param('id', ParseUUIDPipe, OptionAbsencePipe) id: string): Promise<void> {
    return this.optionsService.deleteOption(id);
  }
}
