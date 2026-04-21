/**
 * CreateConversationUseCase
 * Xử lý logic tạo cuộc trò chuyện mới
 */
export class CreateConversationUseCase {
  constructor(conversationRepository, userRepository) {
    this.conversationRepository = conversationRepository;
    this.userRepository = userRepository;
  }

  async execute(createConversationDTO) {
    createConversationDTO.validate();

    // Kiểm tra tất cả participant tồn tại
    for (const participantId of createConversationDTO.participants) {
      const user = await this.userRepository.findById(participantId);
      if (!user) {
        throw new Error(`User ${participantId} không tồn tại`);
      }
    }

    const { v4: uuidv4 } = await import('uuid');
    const newConversation = {
      id: uuidv4(),
      name: createConversationDTO.name,
      type: createConversationDTO.type,
      participants: createConversationDTO.participants,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: null
    };

    return await this.conversationRepository.create(newConversation);
  }
}
