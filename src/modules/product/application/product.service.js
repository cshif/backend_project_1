import prisma from '../../../prismaClient.js';
import filterNullValues from '../../../common/utils/filterNullValues.js';
import bigIntReplacer from '../../../common/utils/bigIntReplacer.js';

const ProductService = {
  createProduct: async (req, res, next) => {
    const { name, price } = req.body;

    try {
      const row = await prisma.product.create({
        data: filterNullValues({
          name,
          price,
        }),
      });
      return JSON.parse(JSON.stringify(row, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
  getProducts: async (req, res, next) => {
    try {
      const rows = await prisma.product.findMany();
      return JSON.parse(JSON.stringify(rows, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
  getProductById: async (req, res, next) => {
    try {
      const row = await prisma.product.findUniqueOrThrow({
        where: { id: req.params.id },
      });
      return JSON.parse(JSON.stringify(row, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
  updateProduct: async (req, res, next) => {
    const { name, price } = req.body;

    try {
      const row = await prisma.product.update({
        where: { id: req.params.id },
        data: filterNullValues({
          name,
          price,
        }),
      });
      return JSON.parse(JSON.stringify(row, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const row = await prisma.product.delete({
        where: { id: req.params.id },
      });
      return JSON.parse(JSON.stringify(row, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
};

export default ProductService;
