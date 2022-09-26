import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('media')
export class MediaEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  mediaName: string;

  @Column({ type: 'varchar' })
  mediaMimeType: string;

  @Column({ type: 'varchar' })
  mediaPath: string;

  @Column({ type: 'varchar' })
  mediaUrl: string;

  @OneToOne(() => UserEntity, (profileImage) => profileImage.media, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  profileImage: UserEntity;
}
