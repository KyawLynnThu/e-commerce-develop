const responseMessage = require('../../../helpers/resMsgHelper');
const categoryService = require('../../../services/admin/categoryService');

const categoryController = {
  index: async (req, res, next) => {
    categoryService
      .index(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = categoryController;
