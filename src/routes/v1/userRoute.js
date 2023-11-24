const router = require('express').Router();

const userController = require('../../controllers/v1/userController');
const authMiddleware = require('../../middlewares/authMiddleware');
const uploadFileMiddleware = require('../../middlewares/uploadFileMiddleware');

router.put('/:id/profile', authMiddleware, userController.profileUpdate);
router.get('/profile', authMiddleware, userController.profileInfo);

router.post(
  '/profile/upload-image',
  authMiddleware,
  uploadFileMiddleware.upload.single('user_profile'),
  userController.profileImageUpload,
);

router.delete(
  '/profile/delete/:id',
  authMiddleware,
  userController.profileImageDelete,
);

module.exports = router;
