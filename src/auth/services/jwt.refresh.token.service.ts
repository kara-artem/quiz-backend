import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtRefreshToken } from '../entities/jwt.refresh.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class JwtRefreshTokenService {
  constructor(
    @InjectRepository(JwtRefreshToken)
    private readonly jwtRefreshTokenRepository: Repository<JwtRefreshToken>,
  ) {}

  public async findOne(token: string): Promise<JwtRefreshToken> {
    return this.jwtRefreshTokenRepository.findOne({
      relations: ['user'],
      where: { token },
    });
  }

  public async findOneByUserId(user: UserEntity): Promise<JwtRefreshToken> {
    return this.jwtRefreshTokenRepository.findOne({
      relations: ['user'],
      where: { user: { id: user.id } },
    });
  }

  public async add(user: UserEntity): Promise<string> {
    const token = uuid();
    const jwtRefreshToken = new JwtRefreshToken();
    const isTokenExist = await this.findOneByUserId(user);

    jwtRefreshToken.token = token;
    jwtRefreshToken.user = user;

    if (isTokenExist) {
      await this.removeOne(isTokenExist);
    }

    await this.jwtRefreshTokenRepository.save(jwtRefreshToken);

    return token;
  }

  public async removeOne(jwtRefreshToken: JwtRefreshToken): Promise<void> {
    await this.jwtRefreshTokenRepository.remove(jwtRefreshToken);
  }
}
