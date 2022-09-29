import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseException } from '../../common/exceptions/response.exception';
import { CreateOptionsDto } from '../dto/create.options.dto';
import { OptionEntity } from '../entities/option.entity';

@Injectable()
export class OptionsService {
  constructor(@InjectRepository(OptionEntity) private readonly optionRepo: Repository<OptionEntity>) {}

  async getOptionById(id: string): Promise<OptionEntity | null> {
    return this.optionRepo.findOne({ where: { id } });
  }

  async createOptions(data: CreateOptionsDto): Promise<OptionEntity[]> {
    const options = data.options.map((option) => {
      return {
        ...option,
        questionId: data.questionId,
      };
    });
    try {
      return this.optionRepo.save(options);
    } catch (e) {
      Logger.error(e, 'OptionsService.createOptions');
      throw new ResponseException(HttpStatus.BAD_REQUEST, e instanceof Error ? e.message : '');
    }
  }

  async deleteOption(id: string): Promise<void> {
    await this.optionRepo.delete({ id });
  }
}
