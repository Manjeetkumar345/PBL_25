const express = require('express');
const {
  sentNegotiationRequest,
  sentNegotiationResponse,
  recievedNegotiationRequest,
  recievedNegotiationResponse,
  handleNotification,
  captureNotifications,
  handleAcceptedOffers
} = require('../controller/CRUD');

const router = express.Router();

router.route('/sentReq').post(sentNegotiationRequest);
router.route('/sentRes').post(sentNegotiationResponse);
router.route('/recReq').get(recievedNegotiationRequest);
router.route('/recRes').get(recievedNegotiationResponse);
router.route('/sentnotification').post(handleNotification);
router.route('/recnotification').post(captureNotifications);
router.route('/cartadd').get(handleAcceptedOffers)


module.exports = router;
