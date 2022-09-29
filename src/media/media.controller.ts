import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('media')
@Controller('media')
export class MediaController {
  @Get('url/:imgpath')
  seeUploadedFile(@Param('imgpath') imageName: string, @Res() res: Response): void {
    res.sendFile(imageName, { root: './uploads/resized' });
  }
}
