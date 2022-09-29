import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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

  @Column({ type: 'uuid', nullable: true })
  ownerId?: string | null;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  owner?: UserEntity | null;
}
