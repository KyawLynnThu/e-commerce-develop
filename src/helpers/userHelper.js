const db = require('../database/models');

const userHelper = {
  generateUniqueUserName: async (nickName) => {
    try {
      var name = nickName.toLowerCase();
      var mName = name.replace(/[^a-zA-Z0-9 ]/g, '');
      var nName = mName.split(' ').join('');
      var check = await db.User.findOne({
        where: {
          uniqueName: nName,
        },
      });
      var result = {};

      if (!check) {
        result['uniqueName'] = nName;
        result['status'] = true;
      } else {
        var i = 1;
        var generateName = nName;

        while (check) {
          generateName = nName + i;
          check = await db.User.findOne({
            where: {
              uniqueName: generateName,
            },
          });
          i++;
        }
        result['uniqueName'] = generateName;
        result['status'] = true;
      }

      return result;
    } catch (error) {
      var errorResult = {
        status: false,
        msg: error,
      };
      return errorResult;
    }
  },
};

module.exports = userHelper;
