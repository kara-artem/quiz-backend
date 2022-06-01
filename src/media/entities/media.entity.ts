import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('media')
export class MediaEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: string;

  @Column({ type: 'varchar' })
  mediaName: string;

  @Column({ type: 'varchar' })
  mediaMimeType: string;

  @Column({ type: 'varchar' })
  mediaPath: string;

  @Column({ type: 'varchar' })
  mediaUrl: string;
}
