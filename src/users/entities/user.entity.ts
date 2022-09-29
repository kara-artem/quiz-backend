import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { JwtRefreshToken } from '../../auth/entities/jwt.refresh.entity';
import { registrationStatus } from '../enums/registration.status.enum';
import { Exclude } from 'class-transformer';
import { MediaEntity } from '../../media/entities/media.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  passwordHash: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  confirmRegisterToken: string | null;

  @Column({
    type: 'enum',
    enum: registrationStatus,
    default: registrationStatus.CONFIRM_EMAIL,
    nullable: false,
  })
  registrationStatus: registrationStatus;

  @OneToOne(() => MediaEntity, {
    onDelete: 'SET NULL',
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  media?: MediaEntity | null;

  @OneToOne(() => JwtRefreshToken, (jwtRefreshToken) => jwtRefreshToken.user)
  jwtRefreshToken: JwtRefreshToken;
}
