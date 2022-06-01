import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  @Get(':filepath')
  seeUploadedFile(@Param('filepath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads/resized' });
  }
}
