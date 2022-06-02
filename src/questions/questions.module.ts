import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './entities/question.entity';
import { OptionEntity } from './entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity, OptionEntity])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
