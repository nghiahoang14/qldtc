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

module.exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, image, rating } = req.body;
    console.log(req.body);
    const newProduct = new Product({
      title,
      price,
      description,
      image,
      rating: {
        rate: rating?.rate || 0,
        count: rating?.count || 0
      }
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
}