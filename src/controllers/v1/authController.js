const { validationResult } = require('express-validator');

const responseMessage = require('../../helpers/resMsgHelper');
const authService = require('../../services/authService');

const authController = {
  register: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        isSuccess: false,
        message: 'Validation Error',
        errors: errors.array(),
      });
    }

    authService
      .register(req.body)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  login: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        isSuccess: false,
        message: 'Validation Error',
        errors: errors.array(),
      });
    }

    authService
      .login(req.body)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  logout: async (req, res, next) => {
    authService
      .logout(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = authController;
