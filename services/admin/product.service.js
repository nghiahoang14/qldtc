const Product = require("../../models/product.model");

module.exports.getAllProducts = async(find) => {
  return await Product.find(find);
}

module.exports.createProduct = async (data) => {
  const { title, price, description, image, rating, category } = data;

  const newProduct = new Product({
    title,
    price,
    description,
    image,
    category,
    rating: {
      rate: rating?.rate || 0,
      count: rating?.count || 0
    }
  });

  return await newProduct.save();
};

module.exports.updateProduct = async(id, updateData) => {
  const newData = { ...updateData, updatedAt: new Date() };
  const result = await Product.updateOne({ _id: id }, newData);
  return result.modifiedCount > 0 ? result : null;
}

module.exports.deleteProduct = async (id) => {
  const result = await Product.updateOne({ _id: id }, { deleted: true });
  return result.modifiedCount > 0 ? result : null;
};

exports.getProductDetail = async (id) => {
  return await Product.findOne({ _id: id, deleted: false });
};

