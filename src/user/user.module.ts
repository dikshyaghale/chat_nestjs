import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.enity';
import { UserHashedTokenEntity } from './entity/user-hashed-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/auth/config/jwt.config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserHashedTokenEntity]),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
