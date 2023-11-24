const {
  Category,
  CategorySubgroup,
  Subcategory,
  Brand,
} = require('../database/admin/models');
const {
  Product,
  ProductTranslation,
  ProductImages,
  ProductPrice,
  ProductVariation,
  sequelize,
} = require('../database/models');
const { getLanguageFromHeader } = require('../helpers/getLanguageHelper');
const { uploadMultiProductImages } = require('../helpers/uploadMultipleFile');
const { deleteFile } = require('../utils/deleteFile');

const productService = {
  index: async (req) => {
    try {
      let acceptLanguageHeader = req.headers['accept-language'];
      let languageCode = getLanguageFromHeader(acceptLanguageHeader, false);

      const result = await Product.findAll({
        where: { deletedAt: null },
        attributes: [
          'id',
          'categoryId',
          'subgroupId',
          'subcategoryId',
          'brandId',
          'productSKU',
          'sellerId',
          'productStatus',
        ],
        include: [
          {
            model: ProductTranslation,
            as: 'productTranslation',
            where: { languageCode },
            attributes: ['productId', 'name', 'description', 'languageCode'],
            required: true,
          },
          {
            model: ProductImages,
            as: 'productImages',
            attributes: [
              'productId',
              'productImage',
              'productImageUrl',
              'sort',
            ],
            order: [['sort', 'ASC']],
          },
          {
            model: ProductPrice,
            as: 'productPrice',
            attributes: [
              'productId',
              'unitPrice',
              'stockQty',
              'discountType',
              'discountAmount',
            ],
          },
          {
            model: ProductVariation,
            as: 'productVariation',
            attributes: ['productId', 'colorCode'],
          },
        ],
        order: [
          [sequelize.literal('sort'), 'ASC'],
          ['createdAt', 'DESC'],
        ],
      });

      return {
        status: 200,
        message: 'Product Lists Retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    const t = await sequelize.transaction();
    try {
      const {
        categoryId,
        subgroupId,
        subcategoryId,
        brandId,
        productSKU,
        sellerId,
        name_en,
        description_en,
        name_my,
        description_my,
        name_zh,
        description_zh,
        colorCodes,
        unitPrice,
        stockQty,
        discountType,
        discountAmount,
      } = req.body;

      await productService.checkEntityExists(Category, categoryId, {
        status: 1,
      });
      await productService.checkEntityExists(CategorySubgroup, subgroupId, {
        status: 1,
      });
      await productService.checkEntityExists(Subcategory, subcategoryId, {
        status: 1,
      });
      await productService.checkEntityExists(Brand, brandId);

      const product = await Product.create(
        {
          categoryId,
          subgroupId,
          subcategoryId,
          brandId,
          productSKU,
          sellerId,
          productStatus: 'REQUESTED',
        },
        { transaction: t },
      );

      if (!product) throw new Error('Product creation failed.');

      const productTranslationsData = [
        {
          productId: product.id,
          languageCode: 'en',
          name: name_en,
          description: description_en,
        },
        {
          productId: product.id,
          languageCode: 'my',
          name: name_my,
          description: description_my,
        },
        {
          productId: product.id,
          languageCode: 'zh',
          name: name_zh,
          description: description_zh,
        },
      ];

      const productTranslations = await ProductTranslation.bulkCreate(
        productTranslationsData,
        { transaction: t },
      );

      if (!productTranslations)
        throw new Error('Product translation creation failed.');

      if (req.files) {
        req.files.forEach((file, index) => {
          const order = index + 1;
          file.order = order;
        });

        try {
          const productImages = await uploadMultiProductImages(req.files);

          const productImgData = productImages.map((result) => {
            const order = result.file.order;
            const img = result.result;

            return {
              productId: product.id,
              productImage: img.Key,
              productImageUrl: img.Location,
              sort: order,
              fileType: result.file.mimetype,
              fileName: result.file.originalname,
              fileSize: result.file.size,
            };
          });

          await ProductImages.bulkCreate(productImgData, {
            transaction: t,
          });
        } catch (error) {
          throw new Error(error);
        }
      }

      const createdProductPrice = await ProductPrice.create(
        {
          productId: product.id,
          unitPrice: parseInt(unitPrice),
          stockQty: parseInt(stockQty),
          discountType,
          discountAmount: parseInt(discountAmount),
        },
        { transaction: t },
      );

      if (!createdProductPrice) {
        throw new Error('Product price creation failed.');
      }

      const productVarData = colorCodes.map((color) => {
        return {
          productId: product.id,
          colorCode: color,
        };
      });

      const createdProductVar = await ProductVariation.bulkCreate(
        productVarData,
        { transaction: t },
      );

      if (!createdProductVar)
        throw new Error('Product variation creation failed.');

      await t.commit();

      return {
        status: 200,
        message: 'Product created successfully',
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  show: async (req) => {
    try {
      let acceptLanguageHeader = req.headers['accept-language'];
      let languageCode = getLanguageFromHeader(acceptLanguageHeader, false);

      const result = await Product.findByPk(req.params.id, {
        where: { deletedAt: null },
        attributes: [
          'id',
          'categoryId',
          'subgroupId',
          'subcategoryId',
          'brandId',
          'productSKU',
          'sellerId',
        ],
        include: [
          {
            model: ProductTranslation,
            as: 'productTranslation',
            where: { languageCode },
            attributes: ['productId', 'name', 'description', 'languageCode'],
            required: true,
          },
          {
            model: ProductImages,
            as: 'productImages',
            attributes: [
              'productId',
              'productImage',
              'productImageUrl',
              'sort',
            ],
          },
          {
            model: ProductPrice,
            as: 'productPrice',
            attributes: [
              'productId',
              'unitPrice',
              'stockQty',
              'discountType',
              'discountAmount',
            ],
          },
          {
            model: ProductVariation,
            as: 'productVariation',
            attributes: ['productId', 'colorCode'],
          },
        ],
      });

      if (!result) throw new Error('Product not Found');

      return {
        status: 200,
        message: 'Retrieved Product Details successfully',
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (req) => {
    const t = await sequelize.transaction();
    try {
      const {
        categoryId,
        subgroupId,
        subcategoryId,
        brandId,
        productSKU,
        sellerId,
        name_en,
        description_en,
        name_my,
        description_my,
        name_zh,
        description_zh,
        colorCodes,
        unitPrice,
        stockQty,
        discountType,
        discountAmount,
      } = req.body;

      const productId = req.params.id;

      await productService.checkEntityExists(Category, categoryId, {
        status: 1,
      });
      await productService.checkEntityExists(CategorySubgroup, subgroupId, {
        status: 1,
      });
      await productService.checkEntityExists(Subcategory, subcategoryId, {
        status: 1,
      });
      await productService.checkEntityExists(Brand, brandId);

      const product = await Product.findByPk(productId, { transaction: t });
      if (!product) throw new Error('Product not found.');

      if (product.productStatus !== 'APPROVED')
        throw new Error('Please wait for APPROVAL.');

      const result = await product.update(
        {
          categoryId,
          subgroupId,
          subcategoryId,
          brandId,
          productSKU,
          sellerId,
        },
        { transaction: t },
      );

      if (!result) throw new Error('Product Update failed');

      await ProductTranslation.update(
        {
          name: name_en,
          description: description_en,
        },
        { where: { productId, languageCode: 'en' }, transaction: t },
      );
      await ProductTranslation.update(
        {
          name: name_my,
          description: description_my,
        },
        { where: { productId, languageCode: 'my' }, transaction: t },
      );
      await ProductTranslation.update(
        {
          name: name_zh,
          description: description_zh,
        },
        { where: { productId, languageCode: 'zh' }, transaction: t },
      );

      const updatedPrice = await ProductPrice.update(
        {
          unitPrice: parseInt(unitPrice),
          stockQty: parseInt(stockQty),
          discountType,
          discountAmount: parseInt(discountAmount),
        },
        { where: { productId }, transaction: t },
      );

      if (!updatedPrice) {
        throw new Error('Product price update process failed.');
      }

      await ProductVariation.destroy({
        where: { productId: productId },
        transaction: t,
      });

      for (const colorCode of colorCodes) {
        await ProductVariation.create(
          { colorCode, productId },
          { transaction: t },
        );
      }

      if (req.files) {
        req.files.forEach((file, index) => {
          const order = index + 1;

          file.order = order;
        });

        const productImages = await uploadMultiProductImages(req.files);

        const productImgData = productImages.map((result) => {
          const order = result.file.order;
          const img = result.result;

          return {
            productId,
            productImage: img.Key,
            productImageUrl: img.Location,
            sort: order,
            fileType: result.file.mimetype,
            fileName: result.file.originalname,
            fileSize: result.file.size,
          };
        });

        const productImgs = await ProductImages.findAll({
          where: { productId: productId },
        });
        if (productImgs && productImgs.length > 0) {
          for (const productImage of productImgs) {
            const productImg = productImage.productImage;
            try {
              await deleteFile(productImg);
              await productImage.destroy();
            } catch (error) {
              throw new Error(error);
            }
          }
        }

        await ProductImages.bulkCreate(productImgData, {
          transaction: t,
        });
      }

      await t.commit();
      return {
        status: 200,
        message: 'Product Updated successfully',
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  delete: async (req) => {
    const t = await sequelize.transaction();
    try {
      const productId = req.params.id;

      const product = await Product.findByPk(productId, { transaction: t });
      if (!product) throw new Error('Product not found or deleted.');

      const productImgs = await ProductImages.findAll({
        where: { productId: productId },
      });

      if (productImgs && productImgs.length > 0) {
        for (const productImage of productImgs) {
          const productImg = productImage.productImage;
          try {
            await deleteFile(productImg);
          } catch (error) {
            throw new Error(error);
          }
        }
      }

      await ProductImages.destroy({
        where: {
          productId,
        },
        transaction: t,
      });

      await ProductTranslation.destroy({
        where: {
          productId,
        },
        transaction: t,
      });

      await ProductPrice.destroy({
        where: {
          productId,
        },
        transaction: t,
      });

      await ProductVariation.destroy({
        where: {
          productId,
        },
        transaction: t,
      });

      await Product.destroy({
        where: {
          id: productId,
        },
        transaction: t,
      });

      await t.commit();
      return {
        status: 200,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  checkEntityExists: async (
    entityModel,
    entityId,
    additionalConditions = {},
  ) => {
    const conditions = {
      id: entityId,
      deletedAt: null,
      ...additionalConditions, // Additional conditions if provided
    };

    const entityExists = await entityModel.findOne({ where: conditions });

    if (!entityExists) {
      throw new Error(`${entityModel.name} Not Found.`);
    }

    return entityExists;
  },
};

module.exports = productService;
