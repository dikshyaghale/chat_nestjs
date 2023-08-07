import { Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.enity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserHashedTokenEntity } from './entity/user-hashed-token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create = async (body: UserEntity) => {
    return await this.userRepository.save(
      this.userRepository.create({ ...body }),
    );
  };

  getValidUserPass = async (condition: any) => {
    return await this.userRepository.findOne({ where: condition });
  };

  setCurrentRefreshToken = async (hashedToken: UserHashedTokenEntity) => {
    await UserHashedTokenEntity.save(hashedToken);
  };

  findAll = async () => {
    return await this.userRepository.find();
  };
}
