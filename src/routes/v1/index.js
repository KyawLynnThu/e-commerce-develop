const router = require('express').Router();

const authRoute = require('./authRoute');
const brandRoute = require('./brandRoute');
const categoryRoute = require('./categoryRoute');
const otpRoute = require('./otpRoute');
const productRoute = require('./productRoute');
const userRoute = require('./userRoute');

router.use('/auth', authRoute);
router.use('/otp', otpRoute);
router.use('/users', userRoute);
router.use('/products', productRoute);

router.use('/categories', categoryRoute);
router.use('/brands', brandRoute);

module.exports = router;
