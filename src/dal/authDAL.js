const { User, UserProfile, Phone } = require('../database/models');

const authDAL = {
  getUserByPhone: async (phoneNumber, includePassword = false) => {
    const phoneInfo = await Phone.findOne({ where: { phoneNumber } });

    if (!phoneInfo) {
      return null;
    }

    const attributes = includePassword
      ? { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      : { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] };
    return await User.findByPk(phoneInfo.userId, {
      attributes,
      include: [
        {
          model: UserProfile,
          as: 'Profile',
          attributes: ['userId', 'birthDate', 'gender', 'profileImageUrl'],
        },
        {
          model: Phone,
          as: 'Phone',
          attributes: [
            'phoneNumber',
            'nationalFormat',
            'regionCode',
            'countryCode',
          ],
        },
      ],
    });
  },

  updateUserDeviceToken: async (user, deviceToken) => {
    return user.update({ deviceToken });
  },

  updateUserAuthToken: async (user, newToken) => {
    try {
      await user.update({ authToken: newToken });
    } catch (error) {
      throw new Error(`Failed to update user authToken: ${error.message}`);
    }
  },
};

module.exports = authDAL;
