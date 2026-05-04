/**
 * Video Call Routes
 */
export function setupVideoCallRoutes(express, videoCallController) {
  const router = express.Router();

  router.post('/initiate', (req, res) =>
    videoCallController.initiateCall(req, res)
  );
  router.post('/accept', (req, res) =>
    videoCallController.acceptCall(req, res)
  );
  router.post('/reject', (req, res) =>
    videoCallController.rejectCall(req, res)
  );
  router.post('/end', (req, res) =>
    videoCallController.endCall(req, res)
  );

  return router;
}
