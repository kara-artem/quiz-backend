import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseException } from '../../common/exceptions/response.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new ResponseException(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    return user;
  }
}
