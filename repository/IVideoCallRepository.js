/**
 * IVideoCallRepository Interface
 */
export class IVideoCallRepository {
  async create(videoCall) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByUserId(userId) {
    throw new Error('Method not implemented');
  }

  async update(id, videoCall) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async findActiveCall(initiatorId, receiverId) {
    throw new Error('Method not implemented');
  }
}
