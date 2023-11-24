const Category = require('../../database/admin/models').Category;
const CategorySubgroup =
  require('../../database/admin/models').CategorySubgroup;
const Subcategory = require('../../database/admin/models').Subcategory;
const { getLanguageFromHeader } = require('../../helpers/getLanguageHelper');

const categoryService = {
  index: async (req) => {
    let acceptLanguageHeader = req.headers['accept-language'];
    let lang = getLanguageFromHeader(acceptLanguageHeader);

    try {
      const categoriy = await Category.findAll({});
      const categories = await Category.findAll({
        where: {
          deletedAt: null,
          status: 1,
        },
        attributes: ['id', `categoryName_${lang}`, 'categoryImageUrl'],
        include: {
          model: CategorySubgroup,
          as: 'categorysubgroups',
          where: {
            deletedAt: null,
            status: 1,
          },
          attributes: [
            'id',
            `subgroupName_${lang}`,
            'subgroupImageUrl',
            'categoryId',
          ],
          required: false,
          include: {
            model: Subcategory,
            as: 'subcategories',
            where: {
              status: 1,
            },
            attributes: [
              'id',
              `subcategoryName_${lang}`,
              'subcategoryImageUrl',
            ],
            required: false,
          },
        },
        order: [['sort', 'ASC']],
      });
      console.log(categoriy);

      return {
        status: 200,
        message: `Retrieved All Category Lists Successfully (${lang} language).`,
        data: categories,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = categoryService;
