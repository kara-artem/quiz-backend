import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshToken } from './entities/jwt.refresh.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshTokenService } from './services/jwt.refresh.token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRES },
    }),
    TypeOrmModule.forFeature([JwtRefreshToken]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
