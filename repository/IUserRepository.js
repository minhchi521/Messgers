/**
 * IUserRepository Interface
 * Định nghĩa các phương thức CRUD cho User
 * Tuân theo nguyên tắc Dependency Inversion
 */
export class IUserRepository {
  async create(user) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async update(id, user) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }
}
