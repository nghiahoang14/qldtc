const Order = require("../../models/order.model");

module.exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // Lấy thông tin user nếu cần
      .populate("items.product_id", "title price image") // Lấy thông tin product trong từng item
      .sort({ createdAt: -1 }); // sắp xếp mới nhất trước

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};