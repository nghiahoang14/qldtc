const productService = require("../../services/admin/product.service");
const Product = require('../../models/product.model');

module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false
    }
    const products = await productService.getAllProducts(find);
    res.status(200).json({ message: 'Danh sách sản phẩm', data: products });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
  }
};

module.exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, category, rating ,stock,status} = req.body;
    const image = req.file ? req.file.path : null; 
    const newProduct = new Product({
      title,
      price,
      description,
      image,
       category,
      rating: {
        rate: rating?.rate || 0,
        count: rating?.count || 0
      },
      stock,
      status
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
    const { id } = req.params;
    const updateData = { ...req.body };

    // Nếu có file ảnh được upload, thì cập nhật trường image
    if (req.file) {
      updateData.image = `/upload/${req.file.filename}`;
    }

    const result = await productService.updateProduct(id, updateData);

    if (!result) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm hoặc không có thay đổi nào.'
      });
    }

    res.status(200).json({ message: 'Cập nhật thành công', data: result });
  } catch (error) {
  //   console.error("❌ Lỗi khi cập nhật sản phẩm:", error?.message);
  // console.error("📜 Stack:", error?.stack);
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm',   error: error?.message || error });
  }
}

module.exports.deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    res.status(200).json({ message: 'Đã đánh dấu sản phẩm là đã xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
  }
}

module.exports.detailProduct = async (req, res) => {
  try {
    const product = await productService.getProductDetail(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }
    res.status(200).json({ message: 'Lấy thông tin thành công', data: product });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error });
  }
}
