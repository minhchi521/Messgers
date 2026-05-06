/**
 * Main Application Entry Point
 * Chat Application with Voice Integration
 * Clean Architecture + SOLID Principles
 */
import express from 'express';
import { createServer } from 'http';
import https from 'https';
import { Server as SocketIOServer } from 'socket.io';
import fs from 'fs';
import dotenv from 'dotenv';
import { setupUserRoutes } from './router/userRoutes.js';
import { setupConversationRoutes } from './router/conversationRoutes.js';
import { setupVideoCallRoutes } from './router/videoCallRoutes.js';
import {
  errorHandler,
  loggingMiddleware,
  setupCORS
} from './middleware/middlewares.js';
import { ServiceContainer } from './config/ServiceContainer.js';
import { CreateUserDTO } from './domain/dto/CreateUserDTO.js';
import { CreateConversationDTO } from './domain/dto/CreateConversationDTO.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const USE_HTTPS = process.env.USE_HTTPS === 'true';

// Initialize Express app
const app = express();

// Create HTTP/HTTPS server
let httpServer;
if (USE_HTTPS) {
  try {
    const options = {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem')
    };
    httpServer = https.createServer(options, app);
    console.log('🔐 HTTPS enabled');
  } catch (err) {
    console.error('❌ HTTPS cert not found. Generate with: node generate-cert.js');
    console.error('❌ Falling back to HTTP');
    httpServer = createServer(app);
  }
} else {
  httpServer = createServer(app);
}

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize Service Container
const serviceContainer = new ServiceContainer(io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupCORS(app);
app.use(loggingMiddleware);

// Serve static files
app.use(express.static('public'));

// Routes
const userController = serviceContainer.getService('userController');
const conversationController = serviceContainer.getService('conversationController');
const videoCallController = serviceContainer.getService('videoCallController');

app.use('/api/users', setupUserRoutes(express, userController));
app.use('/api/conversations', setupConversationRoutes(express, conversationController));
app.use('/api/calls', setupVideoCallRoutes(express, videoCallController));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// WebSocket Setup
const webSocketHandler = serviceContainer.getService('webSocketHandler');
webSocketHandler.handleConnections();

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
const protocol = USE_HTTPS ? 'https' : 'http';
const url = `${protocol}://localhost:${PORT}`;

httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Chat Application with Voice           ║
║  Clean Architecture + SOLID            ║
╠════════════════════════════════════════╣
║  Server started on port ${PORT}          ║
║  Environment: ${NODE_ENV}               ║
║  Protocol: ${USE_HTTPS ? 'HTTPS 🔐' : 'HTTP'}            ║
║  URL: ${url}          ║
║  Mobile: https://YOUR_IP:${PORT}        ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
