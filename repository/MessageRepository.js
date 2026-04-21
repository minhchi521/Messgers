/**
 * MessageRepository Implementation
 */
import { IMessageRepository } from './IMessageRepository.js';

export class MessageRepository extends IMessageRepository {
  constructor() {
    super();
    this.messages = new Map();
  }

  async create(message) {
    this.messages.set(message.id, message);
    return message;
  }

  async findById(id) {
    return this.messages.get(id) || null;
  }

  async findByConversationId(conversationId) {
    const result = [];
    for (const message of this.messages.values()) {
      if (message.conversationId === conversationId) {
        result.push(message);
      }
    }
    return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async findAll() {
    return Array.from(this.messages.values());
  }

  async update(id, updatedMessage) {
    if (!this.messages.has(id)) {
      throw new Error('Message không tồn tại');
    }
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async delete(id) {
    if (!this.messages.has(id)) {
      throw new Error('Message không tồn tại');
    }
    this.messages.delete(id);
  }
}
