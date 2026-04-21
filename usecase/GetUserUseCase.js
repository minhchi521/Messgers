/**
 * GetUserUseCase
 * Xử lý logic lấy thông tin người dùng
 */
export class GetUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async executeById(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User không tồn tại');
    }
    return user;
  }

  async executeAll() {
    return await this.userRepository.findAll();
  }
}
