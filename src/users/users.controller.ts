import { Controller, Delete, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserPayloadInterface } from './interfaces/user.payload.interface';
import { UserPayload } from './decorators/user.payload.decorator';
import { UserEntity } from './entities/user.entity';
import { StatusCode } from '../common/decorators/status.code.decorator';
import { UserAbsencePipe } from './pipes/user.absence.pipe';
import { UserResponseDto } from './dto/user.response.dto';
import { StatusCodeResponseDto } from '../common/dto/status.code.response.dto';

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

  @Delete('profile')
  @ApiOkResponse({ type: StatusCodeResponseDto })
  @StatusCode(HttpStatus.OK)
  async deleteProfile(@UserPayload() user: UserPayloadInterface) {
    return await this.userService.deleteUser(user.userId);
  }
}
