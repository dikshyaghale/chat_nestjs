import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:');
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:');
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() body: string) {
    console.log(body, 'body');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log('Received message:', payload);
    this.server.emit('message', `Server: Received your message: ${payload}`);
  }
}
