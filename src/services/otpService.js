const { Otp } = require('../database/models');
const phoneNoHelper = require('../helpers/phoneNoHelper');

const otpService = {
  requestOtp: async (req) => {
    await phoneNoHelper.sendOtp(req.body.phone);
    return {
      status: 200,
      message: 'Send OTP Successfully',
    };
  },

  verifyOtp: async (req) => {
    const { phone, otp } = req.body;
    const otp_result = await Otp.findOne({
      where: {
        phone,
        otp,
      },
    });

    if (otp_result === null) {
      throw new Error('Invalid OTP code.');
    }

    await Otp.update(
      { status: 0 },
      {
        where: {
          phone,
          otp,
        },
      },
    );

    return {
      status: 200,
      message: 'OTP Verified',
    };
  },
};

module.exports = otpService;
