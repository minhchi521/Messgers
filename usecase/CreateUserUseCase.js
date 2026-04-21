/**
 * CreateUserUseCase
 * Xử lý logic tạo người dùng mới
 * Tuân theo nguyên tắc Single Responsibility
 */
export class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(createUserDTO) {
    createUserDTO.validate();

    const existingUser = await this.userRepository.findByEmail(createUserDTO.email);
    if (existingUser) {
      throw new Error('Email đã được sử dụng');
    }

    const { v4: uuidv4 } = await import('uuid');
    const newUser = {
      id: uuidv4(),
      name: createUserDTO.name,
      email: createUserDTO.email,
      avatar: createUserDTO.avatar,
      createdAt: new Date(),
      isOnline: false
    };

    return await this.userRepository.create(newUser);
  }
}
