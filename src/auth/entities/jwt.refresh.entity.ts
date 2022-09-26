import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class JwtRefreshToken extends BaseEntity {
  @Column()
  token: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.jwtRefreshToken, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
