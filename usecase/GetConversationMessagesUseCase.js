/**
 * GetConversationMessagesUseCase
 * Xử lý logic lấy tất cả tin nhắn của một conversation
 */
export class GetConversationMessagesUseCase {
  constructor(messageRepository, conversationRepository) {
    this.messageRepository = messageRepository;
    this.conversationRepository = conversationRepository;
  }

  async execute(conversationId) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new Error('Cuộc trò chuyện không tồn tại');
    }

    return await this.messageRepository.findByConversationId(conversationId);
  }
}
