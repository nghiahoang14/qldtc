const Product = require("../../models/product.model");


module.exports.getAllProducts = async(find) => {
  return await Product.find(find);
}

module.exports.getProductsByCategory = async (categoryId) => {
  return await Product.find({ category: categoryId, deleted: false }).populate('category');
}

module.exports.findProductsAllCategoryIds = async (categoryIds) => {
  return Product.find({
    category: { $in: categoryIds },
    deleted: false
  }).populate('category');
}

