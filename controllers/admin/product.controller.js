const Product = require("../../models/product.model");
module.exports.index = async (req, res) => {
  try {
    const products = await Product.find({deleted: false});
    res.status(200).json(
      { 
        message: 'Danh sách sản phẩm', 
        data: products 
      });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
  }
};

module.exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, image, rating } = req.body;
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

module.exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = {...req.body, updatedAt: new Date()};
    console.log(newData);
    const result = await Product.updateOne(
      { _id: id },       
      newData    
    );

    console.log(result);

    if(!result) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm hoặc không có thay đổi nào.'
      });
    }

    res.status(200).json({ message: 'Cập nhật thành công', data: result });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error });
  }
}

module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Product.updateOne(
      { _id: id },       
      { deleted: true }    
    );

    if(!result) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json({ message: 'Đã đánh dấu sản phẩm là đã xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
  }
}

module.exports.detailProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({_id: id, deleted: false});

    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });

    res.status(200).json({ message: 'Lấy thông tin thành công', data: product });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error });
  }
}
