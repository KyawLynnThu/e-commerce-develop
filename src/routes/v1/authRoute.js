const router = require('express').Router();
const { checkSchema } = require('express-validator');

const authController = require('../../controllers/v1/authController');
const authMiddleware = require('../../middlewares/authMiddleware');
const authSchema = require('../../schemas/v1/authSchema');

router.post(
  '/register',
  checkSchema(authSchema.registerValidationRules),
  authController.register,
);

router.post(
  '/login',
  checkSchema(authSchema.loginValidationRules),
  authController.login,
);

router.post('/logout', authMiddleware, authController.logout);
module.exports = router;
