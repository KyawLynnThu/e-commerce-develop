const dayjs = require('dayjs');

const { User, UserProfile, Media, sequelize } = require('../database/models');
const uploadProfile = require('../helpers/uploadProfile');
const { deleteFile } = require('../utils/deleteFile');

const userService = {
  profileUpdate: async (req) => {
    const t = await sequelize.transaction();
    try {
      const user_id = req.headers.userId;
      const requestedUserId = req.params.id;

      if (user_id != requestedUserId) {
        throw new Error('Unauthorized');
      }

      // Check if the user to be updated exists
      const user = await User.findByPk(requestedUserId);
      if (!user) {
        throw new Error('User Not Found');
      }

      if (req.body.firstName !== null) {
        await User.update(
          { firstName: req.body.firstName },
          { where: { id: requestedUserId } },
          { transaction: t },
        );
      }

      if (req.body.lastName !== null) {
        await User.update(
          { lastName: req.body.lastName },
          { where: { id: requestedUserId } },
          { transaction: t },
        );
      }

      if (req.body.nickName !== null) {
        await User.update(
          { nickName: req.body.nickName },
          { where: { id: requestedUserId } },
          { transaction: t },
        );
      }

      if (req.body.email !== null && req.body.email !== '') {
        await User.update(
          { email: req.body.email },
          { where: { id: requestedUserId } },
          { transaction: t },
        );
      }

      // Update/Create on UserProfile table
      var user_profile = await UserProfile.findOne({
        where: {
          userId: requestedUserId,
        },
      });

      const birthDate = dayjs(req.body.birthDate).format('YYYY-MM-DD');

      const userProfileAttributes = {
        birthDate: birthDate,
        gender: req.body.gender,
        city: req.body.city,
        region: req.body.region,
        township: req.body.township,
      };

      if (!user_profile) {
        await UserProfile.create(
          {
            ...userProfileAttributes,
            userId: requestedUserId,
          },
          { transaction: t },
        );
      } else {
        await UserProfile.update(userProfileAttributes, {
          where: { userId: requestedUserId },
          transaction: t,
        });
      }

      await t.commit();
      return {
        status: 200,
        message: 'Profile updated Successfully',
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  profileImageUpload: async (req) => {
    const t = await sequelize.transaction();
    try {
      if (!req.file) {
        throw new Error('No File Uploaded.');
      }

      const result = await uploadProfile.uploadFile(req.file);

      await Media.create(
        {
          mediableType: req.body.media_type,
          mediableId: req.headers.userId,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          filePath: result.Key,
          fileType: req.file.mimetype,
        },
        { transaction: t },
      );

      if (req.body.media_type === 'user_profile_image') {
        const [updatedRowCount] = await UserProfile.update(
          { profileImageUrl: result.Key },
          {
            where: {
              userId: req.headers.userId,
            },
          },
          { transaction: t },
        );
        if (updatedRowCount !== 1) {
          throw new Error('User profile upload failed.');
        }
      }
      await t.commit();

      const data = {
        Key: result.Key,
        Location: result.Location,
      };
      return {
        status: 200,
        message: 'File uploaded Successfully',
        data,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  profileImageDelete: async (req) => {
    const t = await sequelize.transaction();
    try {
      const media = await Media.findOne({
        where: {
          id: req.params.id,
        },
        transaction: t,
      });

      if (!media) {
        throw new Error(`File not found!`);
      }

      if (media.mediableId != req.headers.userId) {
        throw new Error(`You can't delete other User Profile`);
      }

      if (req.body.media_type == 'user_profile_image') {
        if (media.id && media.mediableType != 'user_profile_image') {
          throw new Error(`There is no Media with 'user_profile_image' Type`);
        }

        const profile = await UserProfile.findOne({
          where: { userId: req.headers.userId },
          transaction: t,
        });

        const key = profile.profileImageUrl;
        const deletionResult = await deleteFile(key);

        if (
          deletionResult.DeleteMarker === true ||
          deletionResult.$metadata.httpStatusCode === 204
        ) {
          if (media.filePath == profile.profileImageUrl) {
            await UserProfile.update(
              { profileImageUrl: null },
              {
                where: {
                  userId: req.headers.userId,
                },
                transaction: t,
              },
            );

            await Media.destroy({
              where: {
                id: req.params.id,
              },
              transaction: t,
            });
          } else {
            await Media.destroy({
              where: {
                id: req.params.id,
              },
              transaction: t,
            });
          }
        } else {
          throw new Error(`Error deleting file`);
        }
      }

      // Commit the transaction after successful operations
      await t.commit();

      return {
        status: 200,
        message: 'File deleted successfully',
        data: null, // Update this with relevant data if needed
      };
    } catch (error) {
      // Rollback transaction if an error occurs
      await t.rollback();
      throw new Error(error);
    }
  },

  profileInfo: async (req) => {
    try {
      let userId = req.headers.userId;

      let user = await User.findByPk(userId);
      if (user == null) {
        throw new Error('User Not Found');
      }
      let userprofile = await UserProfile.findOne({
        where: {
          userId: user.id,
        },
      });

      const userProfile = await Media.findOne({
        where: { filePath: userprofile.profileImageUrl },
        attributes: [
          'id',
          'mediableType',
          'mediableId',
          'fileType',
          'filePath',
        ],
      });

      let user_profile = {};

      user_profile['id'] = user.id;
      user_profile['firstName'] = user.firstName;
      user_profile['lastName'] = user.lastName;
      (user_profile['name'] = user.firstName + ' ' + user.lastName),
        (user_profile['nickName'] = user.nickName);
      user_profile['email'] = user.email;
      user_profile['accountId'] = user.accountId;
      user_profile['uniqueName'] = user.uniqueName;
      user_profile['userType'] = user.userType;
      user_profile['userProfile'] = userProfile;

      let profile = await UserProfile.findOne({
        where: {
          userId: user.id,
        },
      });

      if (profile) {
        user_profile['birthDate'] = profile.birthDate;
        user_profile['gender'] = profile.gender;
        user_profile['region'] = profile.region;
        user_profile['city'] = profile.city;
        user_profile['township'] = profile.township;
        user_profile['profileImageUrl'] = profile.profileImageUrl;
        user_profile['coverImageUrl'] = profile.coverImageUrl;
      }

      return {
        status: 200,
        message: 'Retrieve Profile Info Successfully',
        data: user_profile,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = userService;
