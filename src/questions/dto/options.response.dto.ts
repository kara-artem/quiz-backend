import { HttpStatus } from '@nestjs/common';
import { OptionEntity } from '../entities/option.entity';

export class OptionsResponseDto {
  statusCode: HttpStatus;
  message: Array<string>;
  data: OptionEntity[];
}
