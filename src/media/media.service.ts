import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseException } from '../common/exceptions/response.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { MediaEntity } from './entities/media.entity';
@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaEntityRepo: Repository<MediaEntity>,
  ) {}

  async saveMedia(file): Promise<MediaEntity> {
    try {
      return await this.mediaEntityRepo.save({
        mediaName: file.filename,
        mediaPath: `uploads/resized/${file.filename}`,
        mediaMimeType: file.mimetype,
        mediaUrl: `/api/media/${file.filename}`,
      });
    } catch (e) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }

  async resizeMedia(file: any): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sharp = require('sharp');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');

    const { filename: image } = file;

    await sharp(file.path).resize(600, 600).jpeg({ quality: 90 }).toFile(path.resolve(file.destination, 'resized', image));
    fs.unlinkSync(file.path);
  }

  async removeMedia(media: MediaEntity): Promise<DeleteResult> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    fs.unlinkSync(media.mediaPath);

    try {
      return await this.mediaEntityRepo.delete({ id: media.id });
    } catch (e) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }
}
