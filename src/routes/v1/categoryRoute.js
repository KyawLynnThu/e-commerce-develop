const router = require('express').Router();

const categoryController = require('../../controllers/v1/admin/categoryController');

router.get('/', categoryController.index);

module.exports = router;
