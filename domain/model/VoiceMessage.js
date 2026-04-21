/**
 * VoiceMessage Model
 * Đại diện cho một tin nhắn voice trong hệ thống chat
 */
export class VoiceMessage {
  constructor(id, senderId, audioUrl, duration, conversationId) {
    this.id = id;
    this.senderId = senderId;
    this.audioUrl = audioUrl;
    this.duration = duration; // thời gian voice tính bằng giây
    this.conversationId = conversationId;
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
      audioUrl: this.audioUrl,
      duration: this.duration,
      conversationId: this.conversationId,
      createdAt: this.createdAt,
      isRead: this.isRead
    };
  }
}
