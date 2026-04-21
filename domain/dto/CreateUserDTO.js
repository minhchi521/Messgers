/**
 * CreateUserDTO
 * DTO để tạo người dùng mới
 */
export class CreateUserDTO {
  constructor(name, email, avatar = null) {
    this.name = name;
    this.email = email;
    this.avatar = avatar;
  }

  validate() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Tên người dùng không được trống');
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Email không hợp lệ');
    }
    return true;
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
