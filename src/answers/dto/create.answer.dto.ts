import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsUUID()
  optionId: string;
}
