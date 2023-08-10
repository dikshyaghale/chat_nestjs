import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserHashedTokenEntity } from 'src/user/entity/user-hashed-token.entity';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

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

  validate(token: any) {
    return this.verifyAsync(token, process.env.JWT_SECRET);
  }

  private verifyAsync(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded: JwtPayload) => {
        if (err) {
          // Handle the error here
          console.error(`Token verification failed: ${err.message}`);

          if (err instanceof JsonWebTokenError) {
            // reject(new Error('Invalid token, please log in again.'));
            throw new Error('Invalid token, please log in again.');
          } else {
            reject(err);
          }
        } else {
          resolve(decoded);
        }
      });
    });

    // return new Promise((resolve, reject) => {
    //   jwt.verify(token, secret, (err, payload) => {
    //     if (err) reject(err);
    //     else resolve(payload);
    //   });
    // });
  }
}
