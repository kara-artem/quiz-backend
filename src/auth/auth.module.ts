import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshToken } from './entities/jwt.refresh.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getJWTConfig } from '../common/configs/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtTokenService } from './services/jwt.token.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    TypeOrmModule.forFeature([JwtRefreshToken]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtTokenService],
  controllers: [AuthController],
  exports: [AuthService, JwtTokenService],
})
export class AuthModule {}
