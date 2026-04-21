/**
 * Conversation Model
 * Đại diện cho một cuộc trò chuyện (1-1 hoặc nhóm)
 */
export class Conversation {
  constructor(id, name, type = 'private', participants = []) {
    this.id = id;
    this.name = name;
    this.type = type; // 'private' hoặc 'group'
    this.participants = participants; // mảng ID người dùng
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.lastMessage = null;
  }

  addParticipant(userId) {
    if (!this.participants.includes(userId)) {
      this.participants.push(userId);
      this.updatedAt = new Date();
    }
  }

  removeParticipant(userId) {
    this.participants = this.participants.filter(id => id !== userId);
    this.updatedAt = new Date();
  }

  updateLastMessage(message) {
    this.lastMessage = message;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      participants: this.participants,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastMessage: this.lastMessage
    };
  }
}
