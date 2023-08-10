import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserSocket } from '../utils/user.interface';

export const WsConnetedUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const client: UserSocket = context.switchToWs().getClient<UserSocket>();
    return client?.user || {};
  },
);
