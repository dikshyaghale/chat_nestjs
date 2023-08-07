import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserHashedTokenEntity } from 'src/user/entity/user-hashed-token.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  validateUser = async (username: string, password: string): Promise<any> => {
    const user = await this.userService.getValidUserPass({
      username,
    });
    if (user) {
      const passwordMatched = await bcrypt.compare(password, user.password);
      if (user && passwordMatched) {
        return user;
      }
    }
    return null;
  };

  login = async (login: LoginDto) => {
    const user = await this.validateUser(login.username, login.password);
    if (user) {
      const payload = {
        userId: user.id,
        username: user.username,
        tokenId: uuid(),
      };
      const accessToken = this.getJwtAccessToken(payload);
      const refreshToken = this.getJwtRefreshToken(payload);

      const hashedToken = {
        token: await bcrypt.hash(refreshToken, 10),
        tokenId: payload.tokenId,
        user: { id: payload.userId },
      };
      await this.userService.setCurrentRefreshToken(
        new UserHashedTokenEntity(hashedToken),
      );
      return {
        accessToken,
        refreshToken,
      };
    } else {
      return { message: 'Username and password does not match!' };
    }
  };

  getJwtAccessToken = (tokenPayload: any = {}) => {
    return this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
  };

  getJwtRefreshToken = (tokenPayload: any = {}) => {
    return this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
    });
  };
}
