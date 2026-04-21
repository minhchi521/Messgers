/**
 * WebSocketHandler
 * Xử lý WebSocket events cho real-time chat
 */
export class WebSocketHandler {
  constructor(
    sendMessageUseCase,
    sendVoiceMessageUseCase,
    getUserUseCase,
    userRepository
  ) {
    this.sendMessageUseCase = sendMessageUseCase;
    this.sendVoiceMessageUseCase = sendVoiceMessageUseCase;
    this.getUserUseCase = getUserUseCase;
    this.userRepository = userRepository;
    this.onlineUsers = new Map(); // userId -> socketId
  }

  setupSocketHandlers(io) {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // User joins
      socket.on('user:join', async (data) => {
        await this.handleUserJoin(socket, data);
      });

      // Send text message
      socket.on('message:send', async (data) => {
        await this.handleSendMessage(socket, io, data);
      });

      // Send voice message
      socket.on('message:voice:send', async (data) => {
        await this.handleSendVoiceMessage(socket, io, data);
      });

      // User typing
      socket.on('user:typing', (data) => {
        socket.broadcast.emit('user:typing', {
          userId: data.userId,
          conversationId: data.conversationId
        });
      });

      // User stops typing
      socket.on('user:stop-typing', (data) => {
        socket.broadcast.emit('user:stop-typing', {
          userId: data.userId,
          conversationId: data.conversationId
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        this.handleUserDisconnect(socket, io);
      });
    });
  }

  async handleUserJoin(socket, data) {
    const { userId, conversationId } = data;
    try {
      const user = await this.getUserUseCase.executeById(userId);
      await this.userRepository.update(userId, {
        ...user,
        isOnline: true
      });

      this.onlineUsers.set(userId, socket.id);
      socket.join(conversationId);

      socket.emit('user:joined', {
        success: true,
        message: 'Joined conversation',
        user: user
      });

      // Thông báo cho các user khác
      socket.broadcast.emit('user:online', {
        userId: userId,
        status: 'online'
      });

      console.log(`User ${userId} joined conversation ${conversationId}`);
    } catch (error) {
      socket.emit('error', {
        message: error.message
      });
    }
  }

  async handleSendMessage(socket, io, data) {
    try {
      const message = await this.sendMessageUseCase.execute({
        senderId: data.senderId,
        content: data.content,
        conversationId: data.conversationId,
        validate: () => {}
      });

      // Gửi message tới tất cả client trong conversation
      io.to(data.conversationId).emit('message:received', {
        message: message
      });
    } catch (error) {
      socket.emit('error', {
        message: error.message
      });
    }
  }

  async handleSendVoiceMessage(socket, io, data) {
    try {
      const voiceMessage = await this.sendVoiceMessageUseCase.execute({
        senderId: data.senderId,
        audioUrl: data.audioUrl,
        duration: data.duration,
        conversationId: data.conversationId,
        validate: () => {}
      });

      // Gửi voice message tới tất cả client trong conversation
      io.to(data.conversationId).emit('message:voice:received', {
        message: voiceMessage
      });
    } catch (error) {
      socket.emit('error', {
        message: error.message
      });
    }
  }

  async handleUserDisconnect(socket, io) {
    console.log('User disconnected:', socket.id);

    // Tìm userId từ onlineUsers
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === socket.id) {
        this.onlineUsers.delete(userId);
        const user = await this.userRepository.findById(userId);
        if (user) {
          await this.userRepository.update(userId, {
            ...user,
            isOnline: false
          });
        }

        io.emit('user:offline', {
          userId: userId,
          status: 'offline'
        });

        console.log(`User ${userId} went offline`);
        break;
      }
    }
  }

  getOnlineUsers() {
    return Array.from(this.onlineUsers.keys());
  }
}
