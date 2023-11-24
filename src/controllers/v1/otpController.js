const { validationResult } = require('express-validator');

const responseMessage = require('../../helpers/resMsgHelper');
const otpService = require('../../services/otpService');

const otpController = {
  requestOtp: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ isSuccess: false, message: errors.array() });
    }

    otpService
      .requestOtp(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  verifyOtp: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ isSuccess: false, message: errors.array() });
    }

    otpService
      .verifyOtp(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = otpController;
