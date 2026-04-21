/**
 * CreateMessageDTO
 * DTO để tạo tin nhắn văn bản mới
 */
export class CreateMessageDTO {
  constructor(senderId, content, conversationId) {
    this.senderId = senderId;
    this.content = content;
    this.conversationId = conversationId;
  }

  validate() {
    if (!this.senderId || this.senderId.trim().length === 0) {
      throw new Error('ID người gửi không được trống');
    }
    if (!this.content || this.content.trim().length === 0) {
      throw new Error('Nội dung tin nhắn không được trống');
    }
    if (!this.conversationId || this.conversationId.trim().length === 0) {
      throw new Error('ID cuộc trò chuyện không được trống');
    }
    if (this.content.length > 5000) {
      throw new Error('Nội dung tin nhắn không được vượt quá 5000 ký tự');
    }
    return true;
  }
}
