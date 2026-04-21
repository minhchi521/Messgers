/**
 * ConversationRepository Implementation
 */
import { IConversationRepository } from './IConversationRepository.js';

export class ConversationRepository extends IConversationRepository {
  constructor() {
    super();
    this.conversations = new Map();
  }

  async create(conversation) {
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  async findById(id) {
    return this.conversations.get(id) || null;
  }

  async findByUserId(userId) {
    const result = [];
    for (const conversation of this.conversations.values()) {
      if (conversation.participants.includes(userId)) {
        result.push(conversation);
      }
    }
    return result;
  }

  async findAll() {
    return Array.from(this.conversations.values());
  }

  async update(id, updatedConversation) {
    if (!this.conversations.has(id)) {
      throw new Error('Conversation không tồn tại');
    }
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }

  async delete(id) {
    if (!this.conversations.has(id)) {
      throw new Error('Conversation không tồn tại');
    }
    this.conversations.delete(id);
  }
}
