import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected:`, client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected:`, client.id);
    if (client.data?.user) {
      const { workspaceId, userId, username } = client.data.user;
      const room = `workspace:${workspaceId}`;
      client.to(room).emit('workspace:user_left', {
        workspaceId,
        userId,
        username,
      });
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    return 'Hello world!';
  }

  //
  @SubscribeMessage('workspace:join')
  async handleJoinWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      workspaceId: string;
      userId: string;
      username: string;
    },
  ) {
    const room = `workspace:${data.workspaceId}`;
    console.log(
      `[SocketGateway] Client ${client.id} joining room ${room} as ${data.username} (${data.userId})`,
    );

    // Step 1: Attach authenticated user identity to this specific socket connection session
    client.data.user = {
      userId: data.userId,
      workspaceId: data.workspaceId,
      username: data.username,
    };

    // Step 2: Add this socket to the scoped workspace channel room
    await client.join(room);

    // Step 3: Query Socket.io's built-in room adapter for all active sockets currently in this room
    const socketsInRoom = await this.server.in(room).fetchSockets();

    // Step 4: Map socket instances to their user metadata, filtering out any uninitialized connections
    // Deduplicate by userId so multiple tabs from same user don't show duplicates
    const userMap = new Map<string, any>();
    for (const s of socketsInRoom) {
      if (s.data?.user?.userId) {
        userMap.set(s.data.user.userId, s.data.user);
      }
    }
    const allCurrentUsers = Array.from(userMap.values());

    console.log(`[SocketGateway] Active users in ${room}:`, allCurrentUsers);

    // Step 5: Deliver the full active member snapshot directly to the joining user
    client.emit('workspace:sync_users', {
      workspaceId: data.workspaceId,
      users: allCurrentUsers,
    });

    // Step 6: Broadcast to all peers already in the room that a new collaborator entered
    client.to(room).emit('workspace:user_joined', client.data.user);
  }

  @SubscribeMessage('workspace:leave')
  handleLeftWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      workspaceId: string;
      userId: string;
      role: string;
    },
  ) {
    const room = `workspace:${data.workspaceId}`;
    client.leave(room);

    console.log(`user ${data.userId} left workspace ${data.workspaceId}`);
    // Emit to all members that a user left the workspace
    this.server.to(room).emit('workspace:user_left', {
      workspaceId: data.workspaceId,
      userId: data.userId,
      role: data.role,
      message: `${data.role === 'owner' ? 'owner' : 'member'} left workspace`,
    });
  }
}
