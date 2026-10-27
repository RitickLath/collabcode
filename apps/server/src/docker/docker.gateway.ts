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
import { DockerService } from './docker.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
})
export class DockerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly dockerService: DockerService) {}

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

  /**
   * Initializes or attaches the client to the collaborative terminal session:
   * 1. Joins the client to the workspace socket room (`workspace:${workspaceId}`).
   * 2. Replays existing scrollback history buffer ONLY to this newly connected client.
   * 3. Ensures the shared Docker container exec stream (`/bin/sh`) is active and broadcasting
   *    live output to all peers in the room.
   * 4. Emits `terminal:ready` to signal the client that TTY interactions are ready.
   */
  @SubscribeMessage('terminal:init')
  async handleTerminalInit(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      workspaceId: string;
    },
  ) {
    const room = `workspace:${data.workspaceId}`;
    await client.join(room);

    // 1. Send past scrollback history exclusively to this newly joined client
    const history = this.dockerService.getTerminalHistory(data.workspaceId);
    if (history) {
      client.emit('terminal:output', history);
    }

    // 2. Ensure the shared exec stream is active & broadcasts new chunks to the room
    await this.dockerService.createTerminalExec(
      data.workspaceId,
      (chunk: string) => {
        // Broadcast new live output to everyone in the workspace room
        this.server.to(room).emit('terminal:output', chunk);
      },
    );

    client.emit('terminal:ready');
  }

  /**
   * Receives raw terminal input (keystrokes, shortcuts, pasted commands) from the client's xterm
   * and writes it directly into the container's standard input stream.
   */
  @SubscribeMessage('terminal:input')
  async handleTerminalInput(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      workspaceId: string;
      data: string;
    },
  ) {
    this.dockerService.writeToTerminal(data.workspaceId, data.data);
  }
}
