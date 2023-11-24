const { Phone, User } = require('../../database/models');

const authSchema = {
  registerValidationRules: {
    firstName: {
      notEmpty: true,
      errorMessage: 'Fist Name is required.',
    },
    lastName: {
      notEmpty: { errorMessage: 'last Name is required.' },
    },
    nickName: {
      notEmpty: { errorMessage: 'NickName is required.' },
    },
    phone: {
      notEmpty: { errorMessage: 'Phone is required' },
      isLength: {
        options: { min: 7, max: 12 },
        errorMessage:
          'Phone Number Length must be between 7 and 12 characters.',
      },
      custom: {
        options: async (value) => {
          // if (!value.startsWith('09')) {
          //   throw new Error("Phone number must start with '09'");
          // }

          const phone = await Phone.findOne({ where: { phoneNumber: value } });

          if (phone) {
            throw new Error('Failed! Phone Number is already in use!');
          }
        },
      },
    },
    email: {
      notEmpty: { errorMessage: 'Email field is required.' },
      isEmail: { errorMessage: 'Invalid email.' },
      custom: {
        options: (value) => {
          return User.findOne({ where: { email: value } }).then((user) => {
            if (user) {
              throw new Error('Failed! Email is already in use!');
            }
          });
        },
      },
    },
    password: {
      notEmpty: { errorMessage: 'Password field is required.' },
      isLength: {
        options: { min: 6 },
        errorMessage: 'Password Minimum Length must be 6.',
      },
      custom: {
        options: (value) => {
          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/;

          if (!regex.test(value)) {
            throw new Error(
              'Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number.',
            );
          }
          return true;
        },
      },
    },
    // confirm_password: {
    //   custom: {
    //     options: (value, { req }) => {
    //       if (value !== req.body.password) {
    //         throw new Error('Password confirmation does not match password.');
    //       }
    //       return true;
    //     },
    //   },
    // },
  },

  loginValidationRules: {
    phone: {
      notEmpty: { errorMessage: 'Phone is required' },
      isLength: {
        options: { min: 7, max: 13 },
        errorMessage:
          'Phone Number Length must be between 7 and 13 characters.',
      },
    },
    countryCode: {
      notEmpty: { errorMessage: 'Country Code is required' },
    },
    password: {
      notEmpty: { errorMessage: 'Password field is required.' },
      isLength: {
        errorMessage: 'Password should be at least 7 chars long',
        options: { min: 7 },
      },
    },
  },
};

module.exports = authSchema;
