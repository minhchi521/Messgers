/**
 * SendMessageUseCase
 * Xử lý logic gửi tin nhắn văn bản
 */
export class SendMessageUseCase {
  constructor(messageRepository, conversationRepository, userRepository) {
    this.messageRepository = messageRepository;
    this.conversationRepository = conversationRepository;
    this.userRepository = userRepository;
  }

  async execute(createMessageDTO) {
    createMessageDTO.validate();

    // Kiểm tra user tồn tại
    const sender = await this.userRepository.findById(createMessageDTO.senderId);
    if (!sender) {
      throw new Error('Người gửi không tồn tại');
    }

    // Kiểm tra conversation tồn tại
    const conversation = await this.conversationRepository.findById(
      createMessageDTO.conversationId
    );
    if (!conversation) {
      throw new Error('Cuộc trò chuyện không tồn tại');
    }

    // Kiểm tra sender là thành viên của conversation
    if (!conversation.participants.includes(createMessageDTO.senderId)) {
      throw new Error('Bạn không phải là thành viên của cuộc trò chuyện này');
    }

    const { v4: uuidv4 } = await import('uuid');
    const newMessage = {
      id: uuidv4(),
      senderId: createMessageDTO.senderId,
      content: createMessageDTO.content.trim(),
      conversationId: createMessageDTO.conversationId,
      type: 'text',
      createdAt: new Date(),
      isRead: false
    };

    const savedMessage = await this.messageRepository.create(newMessage);

    // Cập nhật lastMessage của conversation
    conversation.updateLastMessage(savedMessage);
    await this.conversationRepository.update(conversation.id, conversation);

    return savedMessage;
  }
}
