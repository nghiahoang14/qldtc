const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt)
}

function pickUserInfo(user) {
  if (!user) return null;
  return {
    _id: user._id,
    name: user.name,
    gmail: user.gmail,
    phone: user.phone,
    address: user.address,
    status: user.status
  };
}

module.exports = {
  hashPassword,
  pickUserInfo
};