import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('options')
export class OptionEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'uuid', nullable: true })
  questionId?: string | null;

  @ManyToOne(() => QuestionEntity, (question) => question.options, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  question: QuestionEntity;
}
