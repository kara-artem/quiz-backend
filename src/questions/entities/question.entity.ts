import { Column, Entity, OneToMany } from 'typeorm';
import { OptionEntity } from './option.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('questions')
export class QuestionEntity extends BaseEntity {
  @Column({ type: 'int', unique: true })
  orderNumber: number;

  @OneToMany(() => OptionEntity, (option) => option.question)
  options: OptionEntity[];
}
