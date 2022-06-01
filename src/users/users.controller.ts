import { Controller, Delete, Get, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserPayloadInterface } from './interfaces/user.payload.interface';
import { UserPayload } from './decorators/user.payload.decorator';
import { UserEntity } from './entities/user.entity';
import { StatusCode } from '../common/decorators/status.code.decorator';
import { UserAbsencePipe } from './pipes/user.absence.pipe';
import { UserResponseDto } from './dto/user.response.dto';
import { StatusCodeResponseDto } from '../common/dto/status.code.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload.utils';
import { FileUploadDto } from '../common/dto/file.upload.dto';
import { CheckFilePipe } from '../common/pipes/check.file.pipe';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  @ApiOkResponse({ type: UserResponseDto })
  @StatusCode(HttpStatus.OK)
  async getProfile(@UserPayload(UserAbsencePipe) user: UserPayloadInterface): Promise<UserEntity> {
    return this.userService.findUserById(user.userId);
  }

  @Post('profile-image')
  @ApiOkResponse({ type: UserResponseDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @StatusCode(HttpStatus.OK)
  async uploadProfileImage(@UserPayload() user: UserPayloadInterface, @UploadedFile(CheckFilePipe) file): Promise<UserEntity> {
    return this.userService.uploadProfileImage(user.userId, file);
  }

  @Delete('profile')
  @ApiOkResponse({ type: StatusCodeResponseDto })
  @StatusCode(HttpStatus.OK)
  async deleteProfile(@UserPayload() user: UserPayloadInterface) {
    return await this.userService.deleteUser(user.userId);
  }
}
