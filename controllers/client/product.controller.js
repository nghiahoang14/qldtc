const Product = require("../../models/product.model");
const productService = require("../../services/client/product.service");
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
    status: "active"
  }
  const products = await productService.getAllProducts(find);
  res.status(200).json({
      message: 'Product created successfully',
      data: products
    });
};



