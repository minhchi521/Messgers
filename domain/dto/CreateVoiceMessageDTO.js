/**
 * CreateVoiceMessageDTO
 * DTO để tạo tin nhắn voice mới
 */
export class CreateVoiceMessageDTO {
  constructor(senderId, audioUrl, duration, conversationId) {
    this.senderId = senderId;
    this.audioUrl = audioUrl;
    this.duration = duration;
    this.conversationId = conversationId;
  }

  validate() {
    if (!this.senderId || this.senderId.trim().length === 0) {
      throw new Error('ID người gửi không được trống');
    }
    if (!this.audioUrl || this.audioUrl.trim().length === 0) {
      throw new Error('URL audio không được trống');
    }
    if (typeof this.duration !== 'number' || this.duration <= 0) {
      throw new Error('Thời lượng voice phải là số dương');
    }
    if (this.duration > 300) {
      throw new Error('Thời lượng voice không được vượt quá 300 giây');
    }
    if (!this.conversationId || this.conversationId.trim().length === 0) {
      throw new Error('ID cuộc trò chuyện không được trống');
    }
    return true;
  }
}
