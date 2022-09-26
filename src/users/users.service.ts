import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseException } from '../common/exceptions/response.exception';
import * as bcrypt from 'bcrypt';
import { registrationStatus } from './enums/registration.status.enum';
import { MediaService } from '../media/media.service';
import { RegistrationDto } from '../auth/dto/registration.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly mediaService: MediaService,
  ) {}

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.media', 'media')
      .where('user.id = :id', {
        id,
      })
      .getOne();
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', {
        email,
      })
      .getOne();
  }

  async createUser(data: RegistrationDto): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    try {
      return await this.userRepo.save({
        name: data.name,
        email: data.email,
        passwordHash,
      });
    } catch (e) {
      Logger.error(e, 'UsersService.createUser');
      throw new ResponseException(HttpStatus.BAD_REQUEST, e instanceof Error ? e.message : '');
    }
  }

  async uploadProfileImage(userId: string, file: Express.Multer.File): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    if (user?.media) {
      await this.mediaService.removeMedia(user.media);
    }
    const media = await this.mediaService.saveMedia(file);
    await this.mediaService.resizeMedia(file);

    try {
      return this.userRepo.save({
        ...user,
        media,
      });
    } catch (e) {
      Logger.error(e, 'UsersService.uploadProfileImage');
      throw new ResponseException(HttpStatus.BAD_REQUEST, e instanceof Error ? e.message : '');
    }
  }

  async saveRegisterToken(userId: string, confirmRegisterToken: string): Promise<void> {
    try {
      await this.userRepo.update(userId, { confirmRegisterToken });
    } catch (e) {
      Logger.error(e, 'UsersService.saveRegisterToken');
      throw new ResponseException(HttpStatus.BAD_REQUEST, e instanceof Error ? e.message : '');
    }
  }

  async confirmRegistration(userId: string): Promise<{ confirmation: string }> {
    try {
      await this.userRepo.update(userId, {
        registrationStatus: registrationStatus.ACTIVE,
        confirmRegisterToken: null,
      });
      return { confirmation: 'success' };
    } catch (e) {
      Logger.error(e, 'UsersService.confirmRegistration');
      throw new ResponseException(HttpStatus.BAD_REQUEST, e instanceof Error ? e.message : '');
    }
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepo.delete({ id });
  }
}
