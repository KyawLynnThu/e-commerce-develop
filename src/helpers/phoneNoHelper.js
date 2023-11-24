require('dotenv').config();
const crypto = require('crypto');

const axios = require('axios');
const libphonenumber = require('google-libphonenumber');
const phoneUtil =
  require('google-libphonenumber').PhoneNumberUtil.getInstance();

const db = require('../database/models');

const Otp = db.Otp;

const phoneNoHelper = {
  storePhoneNumberInfo: async (rawPhoneNumber, countryCode) => {
    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(
        rawPhoneNumber,
        countryCode,
      );

      const nationalFormat = phoneUtil.format(
        phoneNumber,
        libphonenumber.PhoneNumberFormat.NATIONAL,
      );

      const isValid = phoneUtil.isValidNumber(phoneNumber);

      const possibleFormats = phoneNoHelper.getFormattedVersions(phoneNumber);

      const result = {
        phoneNumber: phoneUtil.format(
          phoneNumber,
          libphonenumber.PhoneNumberFormat.E164,
        ),
        nationalFormat,
        countryCode: phoneNumber.getCountryCode(),
        regionCode: phoneUtil.getRegionCodeForNumber(phoneNumber),
        isValid,
        possibleFormats,
      };
      // Return the stored information
      return result;
    } catch (error) {
      console.error('Error parsing phone number:', error);
      return null;
    }
  },

  getFormattedVersions: (phoneNumber) => {
    const possibleFormats = [];

    // Use predefined formats if available
    if (libphonenumber.PhoneNumberFormat.values) {
      for (let i = 0; i < libphonenumber.PhoneNumberFormat.values.length; i++) {
        const format = libphonenumber.PhoneNumberFormat.values[i];
        possibleFormats.push(phoneUtil.format(phoneNumber, format));
      }
    } else {
      // Fallback to manually defined formats
      possibleFormats.push(
        phoneUtil.format(phoneNumber, libphonenumber.PhoneNumberFormat.E164),
      );
      possibleFormats.push(
        phoneUtil.format(
          phoneNumber,
          libphonenumber.PhoneNumberFormat.INTERNATIONAL,
        ),
      );
      possibleFormats.push(
        phoneUtil.format(
          phoneNumber,
          libphonenumber.PhoneNumberFormat.NATIONAL,
        ),
      );
    }

    return possibleFormats;
  },

  generateOtp: (length) => {
    const digits = '0123456789';
    let OTP = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      OTP += digits[randomIndex];
    }

    return OTP;
  },

  sendOtp: async (phone) => {
    try {
      const existingOtp = await Otp.findOne({
        where: {
          phone: phone,
        },
      });

      if (existingOtp) {
        try {
          await existingOtp.destroy();
          console.log(`Existing OTP deleted for ${phone}`);
        } catch (deleteError) {
          throw new Error('Error deleting existing OTP:', deleteError);
        }
      }

      const otp = await phoneNoHelper.generateOtp(6);
      const message = 'TeaTalk: Your OTP is ' + otp;

      if (process.env.SMS_SERVICE_PROVIDER === 'SMSPOH') {
        var data = JSON.stringify({
          to: phone,
          message: message,
          sender: 'SMSPoh',
        });

        var config = {
          method: 'post',
          url: process.env.SMSPOH_API_URL,
          headers: {
            Authorization: process.env.SMSPOH_TOKEN,
            'Content-Type': 'application/json',
          },
          data: data,
        };

        var result = {};

        await axios(config)
          .then(function (response) {
            const client_ref_num = response.data.data.messages[0].id.toString();
            Otp.create({
              phone: phone,
              client_ref: client_ref_num,
              otp: otp,
              isVerify: false,
            });

            result = {
              phone: phone,
              client_ref: client_ref_num,
            };
          })
          .catch(function (error) {
            console.log(error);
            result = { isSuccess: false, message: error };
          });

        return result;
      }
    } catch (error) {
      console.error('Error:', error);
      return null; // Handle errors
    }
  },
};
module.exports = phoneNoHelper;
