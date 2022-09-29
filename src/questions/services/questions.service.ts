import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { QuestionEntity } from '../entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseException } from '../../common/exceptions/response.exception';
import { CreateQuestionDto } from '../dto/create.question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepo: Repository<QuestionEntity>,
  ) {}

  async getQuestionById(id: string): Promise<QuestionEntity | null> {
    return this.questionRepo.findOne({ where: { id } });
  }

  async getQuestions(): Promise<QuestionEntity[] | null> {
    return this.questionRepo.createQueryBuilder('question').leftJoinAndSelect('question.options', 'options').getMany();
  }

  async createQuestion(data: CreateQuestionDto): Promise<QuestionEntity> {
    try {
      return this.questionRepo.save({ ...data });
    } catch (e) {
      Logger.error(e, 'QuestionsService.createQuestion');
      throw new ResponseException(HttpStatus.BAD_REQUEST, e instanceof Error ? e.message : '');
    }
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.questionRepo.delete({ id });
  }
}
