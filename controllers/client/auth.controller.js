const { hashPassword, pickUserInfo } = require("../../helpers/auth.helper");
const bcrypt = require("bcryptjs")
const User = require("../../models/user.model");

module.exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(409).json({ message: 'Email đã được sử dụng.' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      status: 'active'
    });

    return res.status(201).json({
      message: 'Đăng ký thành công!',
      user: pickUserInfo(user)
    });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    res.status(500).json({ message: 'Đăng ký thất bại. Vui lòng thử lại.' });
  }


}

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email không đúng hoặc không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai mật khẩu.' });
    }

    if (user.status === 'banned' || user.status === 'inactive') {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa hoặc chưa kích hoạt.' });
    }

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      user: pickUserInfo(user)
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
}
