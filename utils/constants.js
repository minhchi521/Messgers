/**
 * Application Constants
 */

export const MESSAGE_TYPES = {
  TEXT: 'text',
  VOICE: 'voice',
  IMAGE: 'image',
  FILE: 'file',
  EMOJI: 'emoji'
};

export const CALL_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  ENDED: 'ended',
  MISSED: 'missed',
  IN_PROGRESS: 'in_progress'
};

export const CONVERSATION_TYPES = {
  PRIVATE: 'private',
  GROUP: 'group',
  CHANNEL: 'channel'
};

export const CONNECTION_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  DND: 'dnd' // Do Not Disturb
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_VOICE_DURATION = 300; // 5 minutes
export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_RETRY_ATTEMPTS = 3;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  SERVER_ERROR: 'Internal server error',
  TIMEOUT: 'Request timeout',
  INVALID_INPUT: 'Invalid input',
  DUPLICATE_USER: 'User already exists',
  CALL_IN_PROGRESS: 'Another call is in progress'
};

export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  OK: 'Success'
};

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Chat
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVED: 'message:received',
  TYPING: 'user:typing',
  STOP_TYPING: 'user:stop-typing',
  
  // Voice
  VOICE_SEND: 'message:voice:send',
  VOICE_RECEIVED: 'message:voice:received',
  
  // Video Call
  CALL_INITIATE: 'videocall:initiate',
  CALL_INCOMING: 'videocall:incoming',
  CALL_ACCEPT: 'videocall:accept',
  CALL_REJECT: 'videocall:reject',
  CALL_OFFER: 'videocall:offer',
  CALL_ANSWER: 'videocall:answer',
  ICE_CANDIDATE: 'videocall:ice-candidate',
  CALL_END: 'videocall:end',
  
  // User
  USER_JOIN: 'user:join',
  USER_JOINED: 'user:joined',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  ROOM_INFO: 'room:info',
  ROOM_INFO_RESPONSE: 'room:info:response'
};
