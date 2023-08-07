import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.enity';
import { createdMessage, successMessage } from 'src/common/messages';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { BypassAuth } from 'src/auth/bypass.auth';

@ApiTags('User')
@ApiBearerAuth()
@Controller('api/v1/users')
// @UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Register user' })
  @Post()
  @BypassAuth()
  async registerUser(@Body() body: UserEntity) {
    return {
      statusCode: HttpStatus.CREATED,
      message: createdMessage('User'),
      data: await this.userService.create(body),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  async findAll() {
    return {
      statusCode: HttpStatus.OK,
      message: successMessage,
      data: await this.userService.findAll(),
    };
  }
}
