import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerEntity } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create.answer.dto';
import { ResponseException } from '../common/exceptions/response.exception';
import { OptionsService } from '../questions/services/options.service';
import { GetResultDto } from './dto/get.result.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(AnswerEntity) private readonly answerRepo: Repository<AnswerEntity>,
    private readonly optionsService: OptionsService,
  ) {}

  async getAnswerByQuestionAndUserIds(questionId: string, userId: string): Promise<AnswerEntity | null> {
    return this.answerRepo
      .createQueryBuilder('answer')
      .leftJoin('answer.question', 'question')
      .where('question.id = :questionId', { questionId })
      .andWhere('answer.userId = :userId', { userId })
      .getOne();
  }

  async getAnswersByUserId(userId: string): Promise<AnswerEntity[] | null> {
    return this.answerRepo
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('answer.option', 'option')
      .where('answer.userId = :userId', { userId })
      .getMany();
  }

  async getResult(userId: string): Promise<GetResultDto> {
    const results = await this.getAnswersByUserId(userId);
    const testScore = results?.reduce((sum, item) => {
      return sum + item.option.score;
    }, 0);
    return { answeredQuestions: results?.length, testScore };
  }

  async createAnswer(data: CreateAnswerDto, userId: string): Promise<AnswerEntity> {
    const option = await this.optionsService.getOptionById(data.optionId);

    const existAnswer = option?.questionId && (await this.getAnswerByQuestionAndUserIds(option.questionId, userId));

    if (existAnswer) {
      throw new ResponseException(HttpStatus.CONFLICT, 'The answer to this question already exists');
    }

    try {
      return this.answerRepo.save({ userId, optionId: data.optionId, questionId: option?.questionId });
    } catch (e) {
      Logger.error(e, 'AnswersService.createAnswer');
      throw new ResponseException(HttpStatus.BAD_REQUEST, e instanceof Error ? e.message : '');
    }
  }

  async resetResult(userId: string): Promise<void> {
    const answers = await this.getAnswersByUserId(userId);
    const answersId = answers?.map((item) => item.id);
    answersId && (await this.answerRepo.delete(answersId));
  }
}
