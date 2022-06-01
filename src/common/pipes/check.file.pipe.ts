import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ResponseException } from '../exceptions/response.exception';

export class CheckFilePipe extends ValidationPipe {
  async transform(data) {
    if (!data) {
      throw new ResponseException(HttpStatus.CONFLICT, 'The field with the file should not be empty.');
    }
    return data;
  }
}
