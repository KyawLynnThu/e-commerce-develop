const jwt = require('jsonwebtoken');
const { TokenExpiredError } = require('jsonwebtoken');
const moment = require('moment-timezone');

const config = require('../config/auth.config');
const { User } = require('../database/models');

module.exports = async (req, res, next) => {
  if (!req.headers['authorization']) {
    return res
      .status(403)
      .send({ isSuccess: false, message: 'Token not present!' });
  }

  const token = req.headers['authorization'].split(' ')[1];
  const myanmarTimezone = 'Asia/Yangon';

  try {
    const authorizedData = jwt.verify(token, config.token_secret);
    req.headers['userId'] = authorizedData.id;

    const checkUser = await User.findByPk(authorizedData.id);

    if (!checkUser || checkUser.authToken !== token) {
      throw new Error('Invalid Token');
    }

    const decoded = jwt.decode(token);
    const now = moment().tz(myanmarTimezone);

    if (now.isAfter(moment.unix(decoded.exp).tz(myanmarTimezone))) {
      throw new TokenExpiredError('Token has expired');
    }

    // If everything is fine, proceed to the next middleware or route handler.
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res
        .status(403)
        .send({ isSuccess: false, message: 'Token has expired' });
    } else {
      // Handle other errors gracefully, without logging to console.
      return res
        .status(403)
        .send({ isSuccess: false, message: 'Invalid Token' });
    }
  }
};
