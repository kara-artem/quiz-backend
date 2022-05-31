import { HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseException } from '../common/exceptions/response.exception';
import { RegisterUserDto } from '../auth/dto/register.user.dto';
import * as bcrypt from 'bcrypt';
import { registrationStatus } from './enums/registration.status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findUserById(id: number): Promise<UserEntity> {
    try {
      return await this.userRepo
        .createQueryBuilder('user')
        .where('user.id = :id', {
          id,
        })
        .getOne();
    } catch (e) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepo
        .createQueryBuilder('user')
        .where('user.email = :email', {
          email,
        })
        .getOne();
    } catch (e) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }

  async createUser(data: RegisterUserDto): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    try {
      return await this.userRepo.save({
        name: data.name,
        email: data.email,
        passwordHash,
      });
    } catch (e) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }

  async saveRegisterToken(userId: number, confirmRegisterToken: string): Promise<void> {
    try {
      await this.userRepo.update(userId, { confirmRegisterToken });
    } catch (e) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }

  async confirmRegistration(userId: number): Promise<{ confirmation: string }> {
    const user = await this.findUserById(userId);

    if (user) {
      try {
        await this.userRepo.update(user.id, {
          registrationStatus: registrationStatus.ACTIVE,
          confirmRegisterToken: null,
        });
      } catch (e) {
        throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
      }

      return { confirmation: 'success' };
    }
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    try {
      return await this.userRepo.delete({ id });
    } catch (e) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, e.message);
    }
  }
}
