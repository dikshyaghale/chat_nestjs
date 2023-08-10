import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { WsConnetedUser } from 'src/common/ws-auth.user';

@WebSocketGateway()
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(
    // @ConnectedSocket() client: Socket,
    @WsConnetedUser() client: any,
  ) {
    try {
      console.log(`User ${client.user.userId} connected`);
    } catch (err) {
      console.log(err.name, err.message);
      client.disconnect(true);
    }
  }

  // handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
  //   console.log('Client connected:', client.handshake.headers.token);
  // }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log('Received message:', payload);
    this.server.emit('message', `Server: Received your message: ${payload}`);
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: any) {
    console.log('message create event');
    // console.log(payload, 'payload');
    this.server.emit('message', payload);
  }
}
