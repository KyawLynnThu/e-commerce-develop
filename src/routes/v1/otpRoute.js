const router = require('express').Router();

const otpController = require('../../controllers/v1/otpController');

router.post('/request', otpController.requestOtp);

router.post('/verify', otpController.verifyOtp);

module.exports = router;
