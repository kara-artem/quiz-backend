import { Delete, Get, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserPayloadInterface } from './interfaces/user.payload.interface';
import { UserPayload } from './decorators/user.payload.decorator';
import { UserEntity } from './entities/user.entity';
import { StatusCode } from '../common/decorators/status.code.decorator';
import { UserResponseDto } from './dto/user.response.dto';
import { StatusCodeResponseDto } from '../common/dto/status.code.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadDto } from '../common/dto/file.upload.dto';
import { CheckFilePipe } from '../common/pipes/check.file.pipe';
import { editFileName, imageFileFilter } from '../common/utils/file-upload.utils';
import { QuizController } from '../common/decorators/quiz.controller.decorator';

@QuizController('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  @ApiOkResponse({ type: UserResponseDto })
  @StatusCode(HttpStatus.OK)
  async getProfile(@UserPayload() user: UserPayloadInterface): Promise<UserEntity | null> {
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
  async uploadProfileImage(
    @UserPayload() user: UserPayloadInterface,
    @UploadedFile(CheckFilePipe) file: Express.Multer.File,
  ): Promise<UserEntity> {
    return this.userService.uploadProfileImage(user.userId, file);
  }

  @Delete('profile')
  @ApiOkResponse({ type: StatusCodeResponseDto })
  @StatusCode(HttpStatus.OK)
  async deleteProfile(@UserPayload() user: UserPayloadInterface): Promise<void> {
    return this.userService.deleteUser(user.userId);
  }
}
