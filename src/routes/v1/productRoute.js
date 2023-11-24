const router = require('express').Router();

const productController = require('../../controllers/v1/productController');
const uploadFileMiddleware = require('../../middlewares/uploadFileMiddleware');

router
  .route('/')
  .get(productController.index)
  .post(uploadFileMiddleware.generateUploadMiddleware, productController.store);

router
  .route('/:id')
  .get(productController.show)
  .put(uploadFileMiddleware.generateUploadMiddleware, productController.update)
  .delete(productController.destroy);

module.exports = router;
