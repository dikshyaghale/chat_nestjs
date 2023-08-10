import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AuthService } from 'src/auth/auth.service';

export class WsCustomAdapter extends IoAdapter {
  private authService: AuthService;
  constructor(private app: INestApplicationContext) {
    super(app);
    this.authService = app.get(AuthService);
  }

  public create(port: number, options: any = {}): any {
    const server = super.createIOServer(port, options);
    server.use(async (socket, next) => {
      const token = socket.handshake.headers.token;
      if (!token) {
        return next(new Error('Token is required!'));
      }
      const payload: any = await this.authService.validate(token);
      socket.user = payload;
      next();
    });

    return server;
  }
}
