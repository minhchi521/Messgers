/**
 * VideoCallController
 * Xử lý HTTP requests liên quan đến Video Call
 */
export class VideoCallController {
  constructor(initiateVideoCallUseCase, respondVideoCallUseCase) {
    this.initiateVideoCallUseCase = initiateVideoCallUseCase;
    this.respondVideoCallUseCase = respondVideoCallUseCase;
  }

  async initiateCall(req, res) {
    try {
      const call = await this.initiateVideoCallUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: call,
        message: 'Video call initiated'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async acceptCall(req, res) {
    try {
      const { callId } = req.body;
      const call = await this.respondVideoCallUseCase.executeAccept(callId);
      res.status(200).json({
        success: true,
        data: call,
        message: 'Call accepted'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async rejectCall(req, res) {
    try {
      const { callId } = req.body;
      const call = await this.respondVideoCallUseCase.executeReject(callId);
      res.status(200).json({
        success: true,
        data: call,
        message: 'Call rejected'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async endCall(req, res) {
    try {
      const { callId } = req.body;
      const call = await this.respondVideoCallUseCase.executeEnd(callId);
      res.status(200).json({
        success: true,
        data: call,
        message: 'Call ended'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
