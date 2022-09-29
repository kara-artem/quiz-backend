import { HttpStatus, Inject, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ResponseException } from '../../common/exceptions/response.exception';
import { RequestPayloadInterface } from '../../common/interfaces/request.payload.interface';
import { OptionsService } from '../services/options.service';

export class OptionAbsencePipe extends ValidationPipe {
  constructor(
    @Inject(REQUEST) public request: RequestPayloadInterface,
    private readonly optionsService: OptionsService,
  ) {
    super({
      transform: true,
    });
  }

  override async transform(id: string): Promise<string> {
    const option = await this.optionsService.getOptionById(id);

    if (!option) {
      throw new ResponseException(HttpStatus.NOT_FOUND, 'Option not found.');
    }

    return id;
  }
}
