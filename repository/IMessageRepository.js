/**
 * IMessageRepository Interface
 * Định nghĩa các phương thức CRUD cho Message
 */
export class IMessageRepository {
  async create(message) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByConversationId(conversationId) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async update(id, message) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }
}
