/**
 * InitiateVideoCallDTO
 * DTO để tạo cuộc gọi video mới
 */
export class InitiateVideoCallDTO {
  constructor(initiatorId, receiverId, conversationId) {
    this.initiatorId = initiatorId;
    this.receiverId = receiverId;
    this.conversationId = conversationId;
  }

  validate() {
    if (!this.initiatorId || this.initiatorId.trim().length === 0) {
      throw new Error('ID người gọi không được trống');
    }
    if (!this.receiverId || this.receiverId.trim().length === 0) {
      throw new Error('ID người nhận không được trống');
    }
    if (this.initiatorId === this.receiverId) {
      throw new Error('Không thể gọi cho chính mình');
    }
    if (!this.conversationId || this.conversationId.trim().length === 0) {
      throw new Error('ID cuộc trò chuyện không được trống');
    }
    return true;
  }
}

/**
 * RespondVideoCallDTO
 * DTO để phản hồi cuộc gọi video
 */
export class RespondVideoCallDTO {
  constructor(callId, userId, response) {
    this.callId = callId;
    this.userId = userId;
    this.response = response; // 'accept' or 'reject'
  }

  validate() {
    if (!this.callId || this.callId.trim().length === 0) {
      throw new Error('ID cuộc gọi không được trống');
    }
    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error('ID người dùng không được trống');
    }
    if (!['accept', 'reject'].includes(this.response)) {
      throw new Error('Phản hồi phải là "accept" hoặc "reject"');
    }
    return true;
  }
}
