import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtRefreshToken } from '../entities/jwt.refresh.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { UserPayloadInterface } from '../../users/interfaces/user.payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(
    @InjectRepository(JwtRefreshToken)
    private readonly jwtRefreshTokenRepository: Repository<JwtRefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  public async findOne(token: string): Promise<JwtRefreshToken | null> {
    return this.jwtRefreshTokenRepository.findOne({
      relations: ['user'],
      where: { token },
    });
  }

  public async findOneByUserId(userId: string): Promise<JwtRefreshToken | null> {
    return this.jwtRefreshTokenRepository.findOne({
      relations: ['user'],
      where: { userId },
    });
  }

  public async add(user: UserPayloadInterface): Promise<string> {
    const token = uuid();
    const jwtRefreshToken = new JwtRefreshToken();
    const isTokenExist = await this.findOneByUserId(user.userId);

    jwtRefreshToken.token = token;
    jwtRefreshToken.userId = user.userId;

    if (isTokenExist) {
      await this.removeOne(isTokenExist);
    }

    await this.jwtRefreshTokenRepository.save(jwtRefreshToken);

    return token;
  }

  public async removeOne(jwtRefreshToken: JwtRefreshToken): Promise<void> {
    await this.jwtRefreshTokenRepository.remove(jwtRefreshToken);
  }

  decodeAccess(accessToken: string): UserPayloadInterface | null {
    return this.jwtService.decode(accessToken) as UserPayloadInterface | null;
  }
}
