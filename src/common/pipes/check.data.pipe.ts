import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ResponseException } from '../exceptions/response.exception';

export class CheckDataPipe extends ValidationPipe {
  override async transform<T extends object>(data: T): Promise<T> {
    if (Object.keys(data).length === 0) {
      throw new ResponseException(HttpStatus.CONFLICT, 'Please enter the data.');
    }
    return data;
  }
}
