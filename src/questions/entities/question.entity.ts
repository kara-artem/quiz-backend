import { CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OptionEntity } from './option.entity';

@Entity('questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: string;

  @OneToMany(() => OptionEntity, (option) => option.question)
  options: OptionEntity[];
}
