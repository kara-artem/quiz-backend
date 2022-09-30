import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { QuestionEntity } from '../../questions/entities/question.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { OptionEntity } from '../../questions/entities/option.entity';

@Entity('answers')
export class AnswerEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  questionId?: string | null;

  @ManyToOne(() => QuestionEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  question: QuestionEntity;

  @Column({ type: 'uuid', nullable: true })
  optionId?: string | null;

  @ManyToOne(() => OptionEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  option: OptionEntity;

  @Column({ type: 'uuid', nullable: true })
  userId?: string | null;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
