/**
 * UserRepository Implementation
 * Cài đặt IUserRepository với in-memory storage
 */
import { IUserRepository } from './IUserRepository.js';

export class UserRepository extends IUserRepository {
  constructor() {
    super();
    this.users = new Map();
  }

  async create(user) {
    if (this.users.has(user.id)) {
      throw new Error('User đã tồn tại');
    }
    this.users.set(user.id, user);
    return user;
  }

  async findById(id) {
    return this.users.get(id) || null;
  }

  async findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findAll() {
    return Array.from(this.users.values());
  }

  async update(id, updatedUser) {
    if (!this.users.has(id)) {
      throw new Error('User không tồn tại');
    }
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id) {
    if (!this.users.has(id)) {
      throw new Error('User không tồn tại');
    }
    this.users.delete(id);
  }
}
