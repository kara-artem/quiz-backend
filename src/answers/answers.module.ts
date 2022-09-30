import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from './entities/answer.entity';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [QuestionsModule, TypeOrmModule.forFeature([AnswerEntity])],
  providers: [AnswersService],
  controllers: [AnswersController],
})
export class AnswersModule {}
