export default class WebSocketHandler {
  constructor(io) {
    this.io = io;
    this.userSockets = new Map(); // userId -> socket
    this.roomMembers = new Map(); // conversationId -> [userIds]
  }

  handleConnections() {
    this.io.on('connection', (socket) => {
      console.log(`✅ User connected: ${socket.id}`);

      // ===== JOIN CONVERSATION =====
      socket.on('user:join', (data) => {
        const { userId, conversationId } = data;

        // Lưu mapping user -> socket
        this.userSockets.set(userId, socket);

        // Join vào room (Socket.IO feature)
        socket.join(conversationId);

        // Track members trong room
        if (!this.roomMembers.has(conversationId)) {
          this.roomMembers.set(conversationId, new Set());
        }
        this.roomMembers.get(conversationId).add(userId);

        console.log(`👤 ${userId} joined ${conversationId}`);
        console.log(`👥 Members in ${conversationId}: ${this.roomMembers.get(conversationId).size}`);

        // Broadcast cho tất cả trong room
        this.io.to(conversationId).emit('user:joined', {
          userId,
          timestamp: new Date().toISOString(),
          totalMembers: this.roomMembers.get(conversationId).size
        });
      });

      // ===== SEND TEXT MESSAGE =====
      socket.on('message:send', (data) => {
        const { senderId, content, conversationId } = data;

        const message = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId,
          content,
          type: 'text',
          createdAt: new Date().toISOString()
        };

        // Broadcast cho TẤT CẢ trong room (bao gồm sender)
        this.io.to(conversationId).emit('message:received', {
          message,
          memberCount: this.roomMembers.get(conversationId)?.size || 0
        });

        console.log(`💬 Message from ${senderId} to ${conversationId}`);
      });

      // ===== SEND VOICE MESSAGE =====
      socket.on('message:voice:send', (data) => {
        const { senderId, audioUrl, duration, conversationId } = data;

        const voiceMessage = {
          id: `voice-${Date.now()}`,
          conversationId,
          senderId,
          audioUrl,
          duration,
          type: 'voice',
          createdAt: new Date().toISOString()
        };

        // Broadcast cho tất cả
        this.io.to(conversationId).emit('message:voice:received', {
          message: voiceMessage,
          memberCount: this.roomMembers.get(conversationId)?.size || 0
        });

        console.log(`🎤 Voice message from ${senderId} to ${conversationId}`);
      });

      // ===== TYPING INDICATOR =====
      socket.on('user:typing', (data) => {
        const { userId, conversationId } = data;

        // Broadcast cho tất cả EXCEPT sender
        socket.broadcast.to(conversationId).emit('user:typing', {
          userId,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('user:stop-typing', (data) => {
        const { userId, conversationId } = data;

        socket.broadcast.to(conversationId).emit('user:stop-typing', {
          userId
        });
      });

      // ===== GET ROOM INFO =====
      socket.on('room:info', (data) => {
        const { conversationId } = data;
        const members = Array.from(this.roomMembers.get(conversationId) || []);

        socket.emit('room:info:response', {
          conversationId,
          members,
          memberCount: members.length
        });
      });

      // ===== DISCONNECT =====
      socket.on('disconnect', () => {
        // Tìm userId
        let userId = null;
        for (const [uid, sock] of this.userSockets.entries()) {
          if (sock.id === socket.id) {
            userId = uid;
            break;
          }
        }

        if (userId) {
          this.userSockets.delete(userId);

          // Remove từ tất cả rooms
          for (const [conversationId, members] of this.roomMembers.entries()) {
            if (members.has(userId)) {
              members.delete(userId);

              // Notify others
              this.io.to(conversationId).emit('user:offline', {
                userId,
                memberCount: members.size
              });

              console.log(`❌ ${userId} left ${conversationId}`);
            }
          }
        }

        console.log(`🔌 User disconnected: ${socket.id}`);
      });
    });
  }

  // Method: Gửi tin nhắn cho specific user
  sendDirectMessage(senderId, receiverId, message) {
    const receiverSocket = this.userSockets.get(receiverId);
    if (receiverSocket) {
      receiverSocket.emit('message:direct', {
        senderId,
        message
      });
    }
  }

  // Method: Gửi tin nhắn cho room
  broadcastToRoom(conversationId, eventName, data) {
    this.io.to(conversationId).emit(eventName, data);
  }

  // Method: Lấy số members online trong room
  getRoomMemberCount(conversationId) {
    return this.roomMembers.get(conversationId)?.size || 0;
  }

  // Method: Lấy danh sách members online
  getRoomMembers(conversationId) {
    return Array.from(this.roomMembers.get(conversationId) || []);
  }
}