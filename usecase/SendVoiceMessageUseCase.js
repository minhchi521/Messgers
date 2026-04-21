/**
 * SendVoiceMessageUseCase
 * Xử lý logic gửi tin nhắn voice
 */
export class SendVoiceMessageUseCase {
  constructor(messageRepository, conversationRepository, userRepository) {
    this.messageRepository = messageRepository;
    this.conversationRepository = conversationRepository;
    this.userRepository = userRepository;
  }

  async execute(createVoiceMessageDTO) {
    createVoiceMessageDTO.validate();

    // Kiểm tra user tồn tại
    const sender = await this.userRepository.findById(createVoiceMessageDTO.senderId);
    if (!sender) {
      throw new Error('Người gửi không tồn tại');
    }

    // Kiểm tra conversation tồn tại
    const conversation = await this.conversationRepository.findById(
      createVoiceMessageDTO.conversationId
    );
    if (!conversation) {
      throw new Error('Cuộc trò chuyện không tồn tại');
    }

    // Kiểm tra sender là thành viên của conversation
    if (!conversation.participants.includes(createVoiceMessageDTO.senderId)) {
      throw new Error('Bạn không phải là thành viên của cuộc trò chuyện này');
    }

    const { v4: uuidv4 } = await import('uuid');
    const newVoiceMessage = {
      id: uuidv4(),
      senderId: createVoiceMessageDTO.senderId,
      audioUrl: createVoiceMessageDTO.audioUrl,
      duration: createVoiceMessageDTO.duration,
      conversationId: createVoiceMessageDTO.conversationId,
      type: 'voice',
      createdAt: new Date(),
      isRead: false
    };

    const savedMessage = await this.messageRepository.create(newVoiceMessage);

    // Cập nhật lastMessage của conversation
    conversation.updateLastMessage(savedMessage);
    await this.conversationRepository.update(conversation.id, conversation);

    return savedMessage;
  }
}
