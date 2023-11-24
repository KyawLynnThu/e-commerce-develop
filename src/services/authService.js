const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

const config = require('../config/auth.config');
const authDAL = require('../dal/authDAL');
const { User, UserProfile, Phone, sequelize } = require('../database/models');
const phoneNoHelper = require('../helpers/phoneNoHelper');
const userHelper = require('../helpers/userHelper');

const authService = {
  register: async (req) => {
    const t = await sequelize.transaction();
    try {
      const {
        firstName,
        lastName,
        nickName,
        email,
        phone,
        password,
        deviceToken,
        birthDate,
        countryCode,
      } = req;

      const uniqueData = await userHelper.generateUniqueUserName(nickName);

      if (!uniqueData.status) {
        throw new Error(`Something went wrong with your name!`);
      }

      const newUser = {
        firstName,
        lastName,
        nickName,
        uniqueName: uniqueData.uniqueName,
        email,
        password: bcrypt.hashSync(password, 8),
        userType: 'USER',
        deviceToken,
      };

      const user = await User.create(newUser, { transaction: t });

      const accountId = new Date().getTime() + user.id;
      await user.update({ accountId }, { transaction: t });

      const phoneInfo = await phoneNoHelper.storePhoneNumberInfo(
        phone,
        countryCode,
      );
      if (!phoneInfo || !phoneInfo.isValid) {
        throw new Error('Invalid phone number.');
      }

      await Phone.create(
        {
          userId: user.id,
          phoneNumber: phoneInfo.phoneNumber,
          nationalFormat: phoneInfo.nationalFormat,
          countryCode: phoneInfo.countryCode,
          regionCode: phoneInfo.regionCode,
          isValid: phoneInfo.isValid,
          possibleFormats: phoneInfo.possibleFormats,
        },
        { transaction: t },
      );

      // Set default birth date if not provided
      const formattedBirthDate = birthDate
        ? dayjs(birthDate).format('YYYY-MM-DD')
        : '1900-01-01';

      await UserProfile.create(
        {
          userId: user.id,
          birthDate: formattedBirthDate,
        },
        { transaction: t },
      );

      const token = authService.signToken(user);

      await user.update({ authToken: token }, { transaction: t });
      await t.commit();

      const userData = await authDAL.getUserByPhone(
        phoneInfo.phoneNumber,
        false,
      );

      return {
        status: 200,
        message: 'Successfully user created.',
        data: userData,
      };
    } catch (error) {
      await t.rollback();
      throw new Error('User registration failed: ' + error.message);
    }
  },

  login: async (req) => {
    try {
      const { phone, countryCode, password, deviceToken } = req;

      const phoneInfo = await phoneNoHelper.storePhoneNumberInfo(
        phone,
        countryCode,
      );
      if (!phoneInfo || !phoneInfo.isValid) {
        throw new Error('Invalid phone number.');
      }

      const user = await authDAL.getUserByPhone(phoneInfo.phoneNumber, true);

      if (!user) {
        throw new Error('User Not Found');
      }

      if (user.accountStatus !== 'ACTIVATE') {
        throw new Error(`Your Account is ${user.accountStatus}`);
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        throw new Error('Invalid Password');
      }

      // Check if the user has an existing token
      if (user.authToken) {
        try {
          // Verify the token's expiration
          jwt.verify(user.authToken, config.token_secret);
        } catch (err) {
          // If the token is expired or invalid, generate a new one
          const newToken = authService.signToken(user);

          // Update the user's authToken in the database with the new token
          await authDAL.updateUserAuthToken(user, newToken);
        }

        await authDAL.updateUserDeviceToken(user, deviceToken);
      } else {
        // If the user doesn't have an existing token, generate a new one
        const token = authService.signToken(user);

        await authDAL.updateUserAuthToken(user, token);
        await authDAL.updateUserDeviceToken(user, deviceToken);
      }

      const userData = await authDAL.getUserByPhone(
        phoneInfo.phoneNumber,
        false,
      );

      return {
        status: 200,
        message: 'Login Successfully',
        data: userData,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  logout: async (req) => {
    const user = await User.findByPk(req.headers['userId']);

    if (!user) {
      throw new Error('User Not Found');
    }

    await authDAL.updateUserAuthToken(user, null);

    return {
      status: 200,
      message: 'Logout Successfully',
    };
  },

  signToken: (user) => {
    return jwt.sign(
      { id: user.id, uniqueName: user.uniqueName },
      config.token_secret,
      {
        expiresIn: config.token_expiresIn,
      },
    );
  },
};

module.exports = authService;
