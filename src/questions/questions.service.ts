import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity } from './entities/question.entity';
import { ResponseException } from '../common/exceptions/response.exception';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepo: Repository<QuestionEntity>,
  ) {}

  async getQuestions(): Promise<QuestionEntity[]> {
    try {
      return await this.questionRepo.createQueryBuilder('question').leftJoinAndSelect('question.options', 'options').getMany();
    } catch (e) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }
}
