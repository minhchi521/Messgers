/**
 * VideoCallRepository Implementation
 */
import { IVideoCallRepository } from './IVideoCallRepository.js';

export class VideoCallRepository extends IVideoCallRepository {
  constructor() {
    super();
    this.videoCalls = new Map();
  }

  async create(videoCall) {
    this.videoCalls.set(videoCall.id, videoCall);
    return videoCall;
  }

  async findById(id) {
    return this.videoCalls.get(id) || null;
  }

  async findByUserId(userId) {
    const result = [];
    for (const call of this.videoCalls.values()) {
      if (call.initiatorId === userId || call.receiverId === userId) {
        result.push(call);
      }
    }
    return result;
  }

  async update(id, updatedCall) {
    if (!this.videoCalls.has(id)) {
      throw new Error('Video call không tồn tại');
    }
    this.videoCalls.set(id, updatedCall);
    return updatedCall;
  }

  async delete(id) {
    if (!this.videoCalls.has(id)) {
      throw new Error('Video call không tồn tại');
    }
    this.videoCalls.delete(id);
  }

  async findActiveCall(initiatorId, receiverId) {
    for (const call of this.videoCalls.values()) {
      if (
        (call.initiatorId === initiatorId && call.receiverId === receiverId) ||
        (call.initiatorId === receiverId && call.receiverId === initiatorId)
      ) {
        if (call.status === 'pending' || call.status === 'accepted') {
          return call;
        }
      }
    }
    return null;
  }
}
