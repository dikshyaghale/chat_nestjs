import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { MessageEntity } from './entity/message.entity';
import { RouteEnum } from 'src/common/route.common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@ApiTags('Message')
@ApiBearerAuth()
@Controller(RouteEnum.MessageRoute)
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create message' })
  async create(@Body() body: MessageEntity) {
    const data = await this.messageService.create(body);
    this.eventEmitter.emit('message.create', data);
    return {
      statusCode: HttpStatus.CREATED,
      data: data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all messages' })
  async findAll() {
    return {
      statusCode: HttpStatus.OK,
      data: await this.messageService.findAll(),
    };
  }
}
