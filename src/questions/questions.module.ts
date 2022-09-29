import { Module } from '@nestjs/common';
import { QuestionsService } from './services/questions.service';
import { QuestionsController } from './questions.controller';
import { OptionEntity } from './entities/option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './entities/question.entity';
import { OptionsService } from './services/options.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity, OptionEntity])],
  providers: [QuestionsService, OptionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
