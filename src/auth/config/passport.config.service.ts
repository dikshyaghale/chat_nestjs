import { Injectable } from '@nestjs/common';
import { AuthOptionsFactory } from '@nestjs/passport';
import { IAuthModuleOptions } from '@nestjs/passport/dist/interfaces/auth-module.options';

@Injectable()
export class PassportConfigService implements AuthOptionsFactory {
  createAuthOptions(): Promise<IAuthModuleOptions> | IAuthModuleOptions {
    return {
      defaultStrategy: 'jwt',
      session: true,
    };
  }
}
