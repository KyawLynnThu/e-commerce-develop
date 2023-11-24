const Brand = require('../../database/admin/models').Brand;

const brandService = {
  index: async () => {
    try {
      const brands = await Brand.findAll({
        where: { deletedAt: null },
        attributes: ['id', 'brandName', 'brandImageUrl'],
      });
      return {
        status: 200,
        message: 'All Brands List',
        data: brands,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = brandService;
