const { validationResult } = require('express-validator');

const responseMessage = require('../../helpers/resMsgHelper');
const userService = require('../../services/userService');

const userController = {
  profileUpdate: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        isSuccess: false,
        message: 'Validation Error',
        errors: errors.array(),
      });
    }

    userService
      .profileUpdate(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  profileImageUpload: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        isSuccess: false,
        message: 'Validation Error',
        errors: errors.array(),
      });
    }

    userService
      .profileImageUpload(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  profileImageDelete: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        isSuccess: false,
        message: 'Validation Error',
        errors: errors.array(),
      });
    }

    userService
      .profileImageDelete(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  profileInfo: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        isSuccess: false,
        message: 'Validation Error',
        errors: errors.array(),
      });
    }

    userService
      .profileInfo(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = userController;
