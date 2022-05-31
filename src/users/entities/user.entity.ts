import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JwtRefreshToken } from '../../auth/entities/jwt.refresh.entity';
import { registrationStatus } from '../enums/registration.status.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  passwordHash: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  confirmRegisterToken: string;

  @Column({
    type: 'enum',
    enum: registrationStatus,
    default: registrationStatus.CONFIRM_EMAIL,
    nullable: false,
  })
  public registrationStatus: registrationStatus;

  @OneToOne(() => JwtRefreshToken, (jwtRefreshToken) => jwtRefreshToken.user, {
    onDelete: 'CASCADE',
  })
  jwtRefreshToken: JwtRefreshToken;
}
