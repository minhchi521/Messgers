/**
 * VideoCall Model
 * Đại diện cho một cuộc gọi video trong hệ thống
 */
export class VideoCall {
  constructor(id, initiatorId, receiverId, conversationId) {
    this.id = id;
    this.initiatorId = initiatorId;
    this.receiverId = receiverId;
    this.conversationId = conversationId;
    this.status = 'pending'; // pending, accepted, rejected, ended
    this.startTime = null;
    this.endTime = null;
    this.duration = 0;
    this.createdAt = new Date();
  }

  accept() {
    this.status = 'accepted';
    this.startTime = new Date();
  }

  reject() {
    this.status = 'rejected';
    this.endTime = new Date();
  }

  end() {
    this.status = 'ended';
    this.endTime = new Date();
    if (this.startTime) {
      this.duration = Math.floor((this.endTime - this.startTime) / 1000);
    }
  }

  toJSON() {
    return {
      id: this.id,
      initiatorId: this.initiatorId,
      receiverId: this.receiverId,
      conversationId: this.conversationId,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
      createdAt: this.createdAt
    };
  }
}
