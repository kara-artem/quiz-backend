import { PipeTransform, Injectable, HttpStatus } from '@nestjs/common';
import { JwtRefreshTokenService } from '../services/jwt.refresh.token.service';
import { JwtRefreshTokenDto } from '../dto/jwt.refresh.token.dto';
import { ResponseException } from '../../common/exceptions/response.exception';

@Injectable()
export class TokenValidationPipe implements PipeTransform<JwtRefreshTokenDto> {
  constructor(private readonly jwtRefreshTokenService: JwtRefreshTokenService) {}

  async transform(jwtRefreshToken: JwtRefreshTokenDto): Promise<JwtRefreshTokenDto> {
    const { refreshToken } = jwtRefreshToken;
    const getJwtRefreshToken = await this.jwtRefreshTokenService.findOne(refreshToken);

    if (!getJwtRefreshToken) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, 'Incorrect refreshToken.');
    }

    return jwtRefreshToken;
  }
}
