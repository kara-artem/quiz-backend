import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsInt()
  orderNumber: number;
}
