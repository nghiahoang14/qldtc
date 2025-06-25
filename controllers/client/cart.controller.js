const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");

// Thêm sản phẩm vào giỏ hàng
module.exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, userId } = req.body;

        if (!productId || !userId) {
            return res.status(400).json({ message: "Thiếu productId hoặc userId" });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Số lượng phải là số nguyên dương" });
        }

        // Kiểm tra người dùng tồn tại
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findOne({ _id: productId, deleted: false, status: "active" });
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại hoặc không khả dụng" });
        }

        // Kiểm tra tồn kho
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });
        }

        // Tìm giỏ hàng
        let cart = await Cart.findOne({
            userId,
            status: "active",
            deleted: false,
        });

        if (!cart) {
            // Tạo giỏ hàng mới
            cart = new Cart({
                userId,
                items: [{ productId, quantity, price: product.price }],
                totalPrice: product.price * quantity,
            });
        } else {
            // Cập nhật giỏ hàng
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                // Sản phẩm đã có, kiểm tra tồn kho với số lượng mới
                const newQuantity = cart.items[itemIndex].quantity + quantity;
                if (product.stock < newQuantity) {
                    return res.status(400).json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });
                }
                cart.items[itemIndex].quantity = newQuantity;
            } else {
                // Thêm sản phẩm mới
                cart.items.push({ productId, quantity, price: product.price });
            }
            // Cập nhật tổng giá
            cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        }

        await cart.save();
        await cart.populate("items.productId");
        res.status(200).json({ message: "Thêm vào giỏ hàng thành công", data: cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xem giỏ hàng
module.exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        // Kiểm tra người dùng tồn tại
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        let cart = await Cart.findOne({
            userId,
            status: "active",
            deleted: false,
        }).populate("items.productId");

        if (!cart) {
            // Tạo giỏ hàng mới nếu không tồn tại
            cart = new Cart({
                userId,
                items: [],
                totalPrice: 0,
                status: "active",
                deleted: false,
            });
            await cart.save();
            return res.status(200).json({ message: "Giỏ hàng chưa có sản phẩm", data: cart });
        }

        res.status(200).json({ message: "Lấy giỏ hàng thành công", data: cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Cập nhật số lượng sản phẩm
module.exports.updateCart = async (req, res) => {
    try {
        const { productId, quantity, userId } = req.body;

        if (!productId || !userId || !Number.isInteger(quantity)) {
            return res.status(400).json({ message: "Thiếu thông tin hoặc số lượng không hợp lệ" });
        }

        // Kiểm tra người dùng tồn tại
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const cart = await Cart.findOne({
            userId,
            status: "active",
            deleted: false,
        });

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" });
        }

        // Kiểm tra sản phẩm và tồn kho
        const product = await Product.findOne({ _id: productId, deleted: false, status: "active" });
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại hoặc không khả dụng" });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1); // Xóa sản phẩm
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        await cart.populate("items.productId");
        res.status(200).json({ message: "Cập nhật giỏ hàng thành công", data: cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
module.exports.removeFromCart = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        // Kiểm tra đầu vào
        if (!productId || !userId) {
            return res.status(400).json({ message: "Thiếu productId hoặc userId" });
        }

        // Kiểm tra định dạng ObjectId hợp lệ
        const mongoose = require('mongoose');
        if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "productId hoặc userId không hợp lệ" });
        }

        // Kiểm tra người dùng tồn tại
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Tìm giỏ hàng
        const cart = await Cart.findOne({
            userId,
            status: "active",
            deleted: false,
        });

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        // Kiểm tra xem productId có trong giỏ hàng không
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.items = cart.items.filter((_, index) => index !== itemIndex);

        // Cập nhật tổng giá
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.price || 0) * (item.quantity || 1); // Kiểm tra an toàn
        }, 0);

        // Lưu giỏ hàng
        await cart.save();

        // Populate thông tin sản phẩm (nếu cần)
        await cart.populate("items.productId");

        // Kiểm tra giỏ hàng rỗng
        if (cart.items.length === 0) {
            // Tùy chọn: Xóa giỏ hàng hoặc cập nhật trạng thái
            // await Cart.deleteOne({ _id: cart._id });
            return res.status(200).json({ message: "Sản phẩm đã xóa, giỏ hàng hiện rỗng", data: cart });
        }

        // Trả về kết quả thành công
        res.status(200).json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công", data: cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
// Xóa toàn bộ giỏ hàng (dùng sau khi đặt hàng)
module.exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const mongoose = require("mongoose");
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "userId không hợp lệ" });
        }

        const cart = await Cart.findOneAndUpdate(
            {
                userId,
                status: "active",
                deleted: false,
            },
            {
                $set: { items: [], totalPrice: 0 }
            },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng", data: cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

