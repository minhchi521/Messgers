/**
 * CreateConversationDTO
 * DTO để tạo cuộc trò chuyện mới
 */
export class CreateConversationDTO {
  constructor(name, type = 'private', participants = []) {
    this.name = name;
    this.type = type;
    this.participants = participants;
  }

  validate() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Tên cuộc trò chuyện không được trống');
    }
    if (!['private', 'group'].includes(this.type)) {
      throw new Error('Loại cuộc trò chuyện không hợp lệ');
    }
    if (!Array.isArray(this.participants) || this.participants.length === 0) {
      throw new Error('Phải có ít nhất một người tham gia');
    }
    return true;
  }
}
