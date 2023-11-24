const responseMessage = require('../../../helpers/resMsgHelper');
const brandService = require('../../../services/admin/brandService');

const brandController = {
  index: async (req, res, next) => {
    brandService
      .index(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = brandController;
