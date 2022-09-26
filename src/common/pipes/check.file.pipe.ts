import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ResponseException } from '../exceptions/response.exception';

export class CheckFilePipe extends ValidationPipe {
  override async transform<T>(data: T): Promise<T> {
    if (!data) {
      throw new ResponseException(HttpStatus.CONFLICT, 'The field with the file should not be empty.');
    }
    return data;
  }
}
