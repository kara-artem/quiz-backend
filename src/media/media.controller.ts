import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { QuizSwaggerDecorator } from '../common/decorators/quiz.swagger.decorator';

@ApiTags('media')
@Controller('media')
export class MediaController {
  @Get('url/:imgpath')
  @QuizSwaggerDecorator('Get media by path')
  seeUploadedFile(@Param('imgpath') imageName: string, @Res() res: Response): void {
    res.sendFile(imageName, { root: './media' });
  }
}
