/**
 * User Routes
 */
export function setupUserRoutes(express, userController) {
  const router = express.Router();

  router.post('/', (req, res) => userController.createUser(req, res));
  router.get('/:id', (req, res) => userController.getUser(req, res));
  router.get('/', (req, res) => userController.getAllUsers(req, res));

  return router;
}
