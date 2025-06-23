const Category = require("../../models/category.model");


module.exports.index = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json({ message: 'Danh sách danh mục', data: category });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục', error });
  }
};

module.exports.createCategory = async (req, res) => {
  try {

    const { name, description, parent, image } = req.body;

    const newCategory = new Category({
      name,
      description,
      parent,

      image

    });
    
    await newCategory.save();

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error });
  }
}

module.exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = {...req.body, updatedAt: new Date()};

    const result = await Category.updateOne(
      { _id: id },       
      newData    
    );

    if(!result) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục hoặc không có thay đổi nào.'
      });
    }

    res.status(200).json({ message: 'Cập nhật thành công', data: result });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error });
  }
}

module.exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Category.deleteOne(
      { _id: id },       
         
    );

    if(!result) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }

    res.status(200).json({ message: 'Đã đánh dấu danh mục là đã xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa danh mục', error });
  }

}


module.exports.detailCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
    }

    res.status(200).json({ message: 'Lấy thông tin danh mục thành công', data: category });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin danh mục', error });
  }
};

