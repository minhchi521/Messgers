/**
 * UserController
 * Xử lý HTTP requests liên quan đến User
 */
export class UserController {
  constructor(createUserUseCase, getUserUseCase) {
    this.createUserUseCase = createUserUseCase;
    this.getUserUseCase = getUserUseCase;
  }

  async createUser(req, res) {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: user,
        message: 'User tạo thành công'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUser(req, res) {
    try {
      const user = await this.getUserUseCase.executeById(req.params.id);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.getUserUseCase.executeAll();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
