/**
 * Conversation Routes
 */
export function setupConversationRoutes(express, conversationController) {
  const router = express.Router();

  router.post('/', (req, res) =>
    conversationController.createConversation(req, res)
  );
  router.get('/:conversationId/messages', (req, res) =>
    conversationController.getMessages(req, res)
  );

  return router;
}
