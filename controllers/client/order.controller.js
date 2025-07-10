const Order = require("../../models/order.model")
const Product = require("../../models/product.model")

module.exports.order = async (req, res) => {
    try {
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
       

        for(const item of items) {
            const product = await Product.findById(item.product_id);
            
            if(!product) {
                return res.status(404).json({ message: `Không thể tìm thấy ${product.title} trong giỏ hàng` });
            }

            if(product.stock < item.quantity) {
                return res.status(404).json({ message: `Sản phẩm ${product.title} đã hết trong giỏ hàng` });
            }

            product.stock -= item.quantity;
            if(product.stock === 0) {
                product.status = 'out_of_stock';
            }
            await product.save();   
        }

       

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


module.exports.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const orders = await Order.find({userId})
            .populate("items.product_id", "title price image deleted")
            .sort({createdAt: -1});
        
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Người dùng chưa có đơn hàng nào.' });
        }

        return res.status(200).json({
            message: 'Lấy danh sách đơn hàng thành công.',
            orders
        });
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng của người dùng:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ khi lấy đơn hàng.',
            error: error.message
        });
    }
}




