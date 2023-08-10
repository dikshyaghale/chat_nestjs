import { Socket } from 'socket.io';
import { UserEntity } from 'src/user/entity/user.enity';

export interface UserSocket extends Socket {
  user?: UserEntity; // Adjust this to the real type of your user object
}
