/**
 * InitiateVideoCallUseCase
 * Xử lý logic gọi video
 */
export class InitiateVideoCallUseCase {
  constructor(videoCallRepository, userRepository) {
    this.videoCallRepository = videoCallRepository;
    this.userRepository = userRepository;
  }

  async execute(initiateVideoCallDTO) {
    initiateVideoCallDTO.validate();

    // Kiểm tra cả hai user tồn tại
    const initiator = await this.userRepository.findById(
      initiateVideoCallDTO.initiatorId
    );
    if (!initiator) {
      throw new Error('Người gọi không tồn tại');
    }

    const receiver = await this.userRepository.findById(
      initiateVideoCallDTO.receiverId
    );
    if (!receiver) {
      throw new Error('Người nhận không tồn tại');
    }

    // Kiểm tra đã có cuộc gọi active không
    const activeCall = await this.videoCallRepository.findActiveCall(
      initiateVideoCallDTO.initiatorId,
      initiateVideoCallDTO.receiverId
    );
    if (activeCall) {
      throw new Error('Đã có cuộc gọi active giữa hai user này');
    }

    const { v4: uuidv4 } = await import('uuid');
    const newCall = {
      id: uuidv4(),
      initiatorId: initiateVideoCallDTO.initiatorId,
      receiverId: initiateVideoCallDTO.receiverId,
      conversationId: initiateVideoCallDTO.conversationId,
      status: 'pending',
      startTime: null,
      endTime: null,
      duration: 0,
      createdAt: new Date()
    };

    return await this.videoCallRepository.create(newCall);
  }
}
