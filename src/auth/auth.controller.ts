import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { successMessage } from 'src/common/messages';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Login' })
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    if (data.message) {
      throw new HttpException(data.message, HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: successMessage,
      data: data,
    };
  }
}
