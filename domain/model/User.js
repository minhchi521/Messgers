/**
 * User Model
 * Đại diện cho một người dùng trong hệ thống chat
 */
export class User {
  constructor(id, name, email, avatar = null) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.createdAt = new Date();
    this.isOnline = false;
  }

  setOnline(status) {
    this.isOnline = status;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      isOnline: this.isOnline,
      createdAt: this.createdAt
    };
  }
}
