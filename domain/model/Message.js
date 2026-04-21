/**
 * Message Model
 * Đại diện cho một tin nhắn văn bản trong hệ thống chat
 */
export class Message {
  constructor(id, senderId, content, conversationId, type = 'text') {
    this.id = id;
    this.senderId = senderId;
    this.content = content;
    this.conversationId = conversationId;
    this.type = type; // 'text' hoặc 'voice'
    this.createdAt = new Date();
    this.isRead = false;
  }

  markAsRead() {
    this.isRead = true;
  }

  toJSON() {
    return {
      id: this.id,
      senderId: this.senderId,
      content: this.content,
      conversationId: this.conversationId,
      type: this.type,
      createdAt: this.createdAt,
      isRead: this.isRead
    };
  }
}
