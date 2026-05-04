/**
 * RespondVideoCallUseCase
 * Xử lý logic phản hồi cuộc gọi video
 */
export class RespondVideoCallUseCase {
  constructor(videoCallRepository) {
    this.videoCallRepository = videoCallRepository;
  }

  async executeAccept(callId) {
    const call = await this.videoCallRepository.findById(callId);
    if (!call) {
      throw new Error('Cuộc gọi không tồn tại');
    }

    if (call.status !== 'pending') {
      throw new Error('Cuộc gọi không còn pending');
    }

    call.status = 'accepted';
    call.startTime = new Date();

    return await this.videoCallRepository.update(callId, call);
  }

  async executeReject(callId) {
    const call = await this.videoCallRepository.findById(callId);
    if (!call) {
      throw new Error('Cuộc gọi không tồn tại');
    }

    if (call.status !== 'pending') {
      throw new Error('Cuộc gọi không còn pending');
    }

    call.status = 'rejected';
    call.endTime = new Date();

    return await this.videoCallRepository.update(callId, call);
  }

  async executeEnd(callId) {
    const call = await this.videoCallRepository.findById(callId);
    if (!call) {
      throw new Error('Cuộc gọi không tồn tại');
    }

    if (call.status !== 'accepted') {
      throw new Error('Cuộc gọi chưa được accept');
    }

    call.status = 'ended';
    call.endTime = new Date();
    if (call.startTime) {
      call.duration = Math.floor((call.endTime - call.startTime) / 1000);
    }

    return await this.videoCallRepository.update(callId, call);
  }
}
