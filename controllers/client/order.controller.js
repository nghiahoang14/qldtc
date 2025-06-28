const Order = require("../../models/order.model")
const Product = require("../../models/product.model")

module.exports.order = async (req, res) => {
    try {
        const { userId, paymentMethod, shippingAddress, items } = req.body;
    
        if (!userId || !paymentMethod || !shippingAddress || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Thông tin đơn hàng không đầy đủ.' });
        }

        for(const item of items) {
            const product = await Product.findById(item.productId);
            
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

        const newOrder = new Order({
            userId,
            paymentMethod,
            shippingAddress,
            items
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

module.exports.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const orders = await Order.find({userId})
            .populate("items.product_id", "title price image")
            .sort({createAt: -1});
        
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

