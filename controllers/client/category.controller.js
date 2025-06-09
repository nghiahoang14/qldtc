const Category = require("../../models/category.model");

module.exports.index = async (req, res) => {
  
  const category = await Category.find();

  res.status(200).json({
      message: 'Category created successfully',
      data: category
    });
};

