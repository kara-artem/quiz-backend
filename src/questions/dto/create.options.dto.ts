import { IsArray, IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class OptionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  score: number;
}

export class CreateOptionsDto {
  @IsNotEmpty()
  @IsUUID()
  questionId: string;

  @IsNotEmpty()
  @IsArray()
  options: OptionDto[];
}
