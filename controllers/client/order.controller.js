const Order = require("../../models/order.model")

module.exports.order = async (req, res) => {
    try {
        console.log(req.body)
        const { userId, paymentMethod, shippingAddress, items,phone,shippingMethod,totalPrice } = req.body;
    
        if (!userId || !paymentMethod || !shippingAddress|| !shippingMethod|| !totalPrice|| !phone || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Thông tin đơn hàng không đầy đủ.' });
        }

        const newOrder = new Order({
        userId,
        paymentMethod,
        shippingAddress,
        items,
        phone,
        shippingMethod,
        totalPrice
        });

        const savedOrder = await newOrder.save();

        return res.status(201).json({
        message: 'Đơn hàng đã được tạo thành công.',
        order: savedOrder
        });
    } catch (error) {
            console.error('Lỗi tạo đơn hàng:', error);
            return res.status(500).json({
            message: 'Lỗi máy chủ khi tạo đơn hàng.',
            error: error.message
        });
    }
}
module.exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("userId");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi máy chủ khi lấy đơn hàng.",
      error: error.message,
    });
  }
};