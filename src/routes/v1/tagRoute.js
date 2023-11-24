const router = require('express').Router();

const otpController = require('../../controllers/v1/otpController');

router.get('/request', otpController.requestOtp);

module.exports = router;
