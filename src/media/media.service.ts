import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ResponseException } from '../common/exceptions/response.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { MediaEntity } from './entities/media.entity';
import fs = require('fs');
import path = require('path');
import sharp = require('sharp');

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaEntityRepo: Repository<MediaEntity>,
  ) {}

  async saveMedia(file: Express.Multer.File): Promise<MediaEntity> {
    try {
      return this.mediaEntityRepo.save({
        mediaName: file.filename,
        mediaPath: `uploads/resized/${file.filename}`,
        mediaMimeType: file.mimetype,
        mediaUrl: `/api/media/${file.filename}`,
      });
    } catch (e) {
      Logger.error(e, 'MediaService.saveMedia');
      throw new ResponseException(HttpStatus.BAD_REQUEST, e instanceof Error ? e.message : '');
    }
  }

  async resizeMedia(file: Express.Multer.File): Promise<void> {
    const { filename: image } = file;

    await sharp(file.path)
      .resize(600, 600)
      .jpeg({ quality: 90 })
      .toFile(path.resolve(file.destination, 'resized', image));
    fs.unlinkSync(file.path);
  }

  async removeMedia(media: MediaEntity): Promise<DeleteResult> {
    fs.unlinkSync(media.mediaPath);
    return this.mediaEntityRepo.delete({ id: media.id });
  }
}
