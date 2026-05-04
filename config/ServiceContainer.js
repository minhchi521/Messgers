/**
 * Service Container / Dependency Injection Container
 * Tập trung quản lý các dependency
 */
import { UserRepository } from '../repository/UserRepository.js';
import { MessageRepository } from '../repository/MessageRepository.js';
import { ConversationRepository } from '../repository/ConversationRepository.js';
import { VideoCallRepository } from '../repository/VideoCallRepository.js';
import { CreateUserUseCase } from '../usecase/CreateUserUseCase.js';
import { GetUserUseCase } from '../usecase/GetUserUseCase.js';
import { SendMessageUseCase } from '../usecase/SendMessageUseCase.js';
import { SendVoiceMessageUseCase } from '../usecase/SendVoiceMessageUseCase.js';
import { GetConversationMessagesUseCase } from '../usecase/GetConversationMessagesUseCase.js';
import { CreateConversationUseCase } from '../usecase/CreateConversationUseCase.js';
import { InitiateVideoCallUseCase } from '../usecase/InitiateVideoCallUseCase.js';
import { RespondVideoCallUseCase } from '../usecase/RespondVideoCallUseCase.js';
import { UserController } from '../controller/UserController.js';
import { ConversationController } from '../controller/ConversationController.js';
import WebSocketHandler from '../websocket/WebSocketHandler.js';

export class ServiceContainer {
  constructor(io = null) {
    this.services = {};
    this.io = io;
    this.initializeServices();
  }

  initializeServices() {
    // Repositories
    this.services.userRepository = new UserRepository();
    this.services.messageRepository = new MessageRepository();
    this.services.conversationRepository = new ConversationRepository();
    this.services.videoCallRepository = new VideoCallRepository();

    // Use Cases
    this.services.createUserUseCase = new CreateUserUseCase(
      this.services.userRepository
    );
    this.services.getUserUseCase = new GetUserUseCase(
      this.services.userRepository
    );
    this.services.sendMessageUseCase = new SendMessageUseCase(
      this.services.messageRepository,
      this.services.conversationRepository,
      this.services.userRepository
    );
    this.services.sendVoiceMessageUseCase = new SendVoiceMessageUseCase(
      this.services.messageRepository,
      this.services.conversationRepository,
      this.services.userRepository
    );
    this.services.getConversationMessagesUseCase = new GetConversationMessagesUseCase(
      this.services.messageRepository,
      this.services.conversationRepository
    );
    this.services.createConversationUseCase = new CreateConversationUseCase(
      this.services.conversationRepository,
      this.services.userRepository
    );
    this.services.initiateVideoCallUseCase = new InitiateVideoCallUseCase(
      this.services.videoCallRepository,
      this.services.userRepository
    );
    this.services.respondVideoCallUseCase = new RespondVideoCallUseCase(
      this.services.videoCallRepository
    );

    // Controllers
    this.services.userController = new UserController(
      this.services.createUserUseCase,
      this.services.getUserUseCase
    );
    this.services.conversationController = new ConversationController(
      this.services.createConversationUseCase,
      this.services.getConversationMessagesUseCase
    );

    // WebSocket Handler
    this.services.webSocketHandler = new WebSocketHandler(this.io);
  }

  getService(serviceName) {
    if (!this.services[serviceName]) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return this.services[serviceName];
  }

  getAllServices() {
    return this.services;
  }
}
