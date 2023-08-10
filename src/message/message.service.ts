import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entity/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  create = async (body: MessageEntity) => {
    // return { body };
    return this.messageRepository.save(
      this.messageRepository.create({ ...body }),
    );
  };

  findAll = async () => {
    return this.messageRepository.find();
  };
}
