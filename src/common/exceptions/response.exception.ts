import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseException extends HttpException {
  constructor(statusCode: HttpStatus, successMessage?: string) {
    const data = {
      statusCode: statusCode,
      message: [successMessage],
    };
    super(data, statusCode);
  }
}
