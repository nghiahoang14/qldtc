const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }
  const products = await Product.find(find);
  res.status(200).json({
      message: 'Product created successfully',
      data: products
    });
};

