import { Column, Entity, OneToOne } from 'typeorm';
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

  @OneToOne(() => MediaEntity, (media) => media.profileImage)
  media: MediaEntity;

  @Column({
    type: 'enum',
    enum: registrationStatus,
    default: registrationStatus.CONFIRM_EMAIL,
    nullable: false,
  })
  registrationStatus: registrationStatus;

  @OneToOne(() => JwtRefreshToken, (jwtRefreshToken) => jwtRefreshToken.user)
  jwtRefreshToken: JwtRefreshToken;
}
