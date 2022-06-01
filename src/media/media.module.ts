import { Global, Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { MediaController } from './media.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity])],
  providers: [MediaService],
  exports: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
