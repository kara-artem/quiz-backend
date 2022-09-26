import { IsNotEmpty, IsUUID } from 'class-validator';

export class JwtRefreshTokenDto {
  @IsNotEmpty()
  @IsUUID()
  refreshToken: string;
}
