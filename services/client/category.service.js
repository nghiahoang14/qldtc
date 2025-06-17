const Category = require("../../models/category.model");

module.exports.getAllSubCategories = async (parentId, result = []) => {
  const children = await Category.find({ parent: parentId });
  for(const child of children) {
    result.push(child);
    await getAllSubCategories(child._id, result);
  }
  return result;
}

module.exports.getAllSubCategoryIds = async function getAllSubCategoryIds(parentId, ids = []) {
  const children = await Category.find({ parent: parentId }, '_id');

  for (const child of children) {
    ids.push(child._id);
    await getAllSubCategoryIds(child._id, ids); 
  }

  return ids;
}

module.exports.findByCategoryId = async (id) => {
  return await Category.findById(id);
}