/**
 * ConversationController
 * Xử lý HTTP requests liên quan đến Conversation
 */
export class ConversationController {
  constructor(createConversationUseCase, getConversationMessagesUseCase) {
    this.createConversationUseCase = createConversationUseCase;
    this.getConversationMessagesUseCase = getConversationMessagesUseCase;
  }

  async createConversation(req, res) {
    try {
      const conversation = await this.createConversationUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: conversation,
        message: 'Conversation tạo thành công'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMessages(req, res) {
    try {
      const messages = await this.getConversationMessagesUseCase.execute(
        req.params.conversationId
      );
      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}
