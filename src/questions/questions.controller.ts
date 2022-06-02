import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionsService } from './questions.service';
import { StatusCode } from '../common/decorators/status.code.decorator';
import { QuestionEntity } from './entities/question.entity';
import { QuestionsResponseDto } from './dto/questions.response.dto';

@ApiTags('Questions')
@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOkResponse({ type: QuestionsResponseDto })
  @StatusCode(HttpStatus.OK)
  async getQuestions(): Promise<QuestionEntity[]> {
    return this.questionsService.getQuestions();
  }
}
