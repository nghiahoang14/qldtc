const { hashPassword, pickUserInfo } = require("../../helpers/auth.helper");
const bcrypt = require("bcryptjs")

const User = require("../../models/user.model");
const sendMailHelper = require("../../helpers/sendMail");
const OtpCode = require("../../models/OtpCode");


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

module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);


  await OtpCode.deleteMany({ email }); 

  await OtpCode.create({ email, otp, expiresAt });
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu là <b style="color: green;">${otp}</b>. Thời hạn sử dụng là 3 phút.
  `;
  sendMailHelper.sendMail(email, subject, html);

  res.json({ message: 'OTP đã gửi đến email' });

}

module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const otpDoc = await OtpCode.findOne({ email, otp });

  if (!otpDoc || otpDoc.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
  }

  res.json({ message: 'OTP hợp lệ, tiếp tục đặt lại mật khẩu' });
};

module.exports.resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Mật khẩu không khớp' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  await OtpCode.deleteMany({ email }); 

  res.json({ message: 'Đặt lại mật khẩu thành công' });
};
