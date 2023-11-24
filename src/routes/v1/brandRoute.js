const router = require('express').Router();

const brandController = require('../../controllers/v1/admin/brandController');

router.get('/', brandController.index);

module.exports = router;
