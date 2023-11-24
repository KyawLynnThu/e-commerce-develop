require('dotenv').config();
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

module.exports = {
  token_secret: JWT_SECRET,
  token_expiresIn: JWT_EXPIRES_IN,
};
