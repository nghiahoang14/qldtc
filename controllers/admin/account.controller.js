const Account = require("../../models/account.model");
const bcrypt = require("bcryptjs")

module.exports.index = async(req, res) => {
    try {
        let find = {
            deleted: false
        }
        const accounts = await Account.find(find);
        res.status(200).json({
            message: "Lấy ra tát cả account thành công!",
            data: accounts
        })
    } catch (error) {
        res.status(400).json({
            message: "Lấy ra tát cả account thất bại!!",
            error: error,
        })
    }
}

module.exports.createAccount = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
        }

        const existing = await Account.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email đã tồn tại.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = new Account({
            name,
            email,
            password: hashedPassword
        });

        const saved = await newAccount.save();

        res.status(201).json({
            message: 'Tạo tài khoản thành công.',
            account: {
                id: saved._id,
                name: saved.name,
                email: saved.email,
                password: hashedPassword,
                status: saved.status
            }
        });
    } catch (error) {
        console.error('Lỗi tạo tài khoản:', error);
        res.status(500).json({ message: 'Lỗi máy chủ.', error: error.message });
    }
}

module.exports.updateAccount = async(req, res) => {
    try {
        const accountId = req.params.id;
        const updates = req.body;

        if (updates.email) {
            const emailExisted = await Account.findOne({
                email: updates.email,
                _id: { $ne: accountId } // Không trùng với chính nó
            });

            if (emailExisted) {
                return res.status(409).json({ message: 'Email đã tồn tại.' });
            }
        }
        
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }


        const updated = await Account.updateOne({
            _id: accountId
        }, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        res.status(200).json({
            message: 'Cập nhật tài khoản thành công.',
            account: {
                id: updated._id,
                name: updated.name,
                email: updated.email,
                status: updated.status
            }
        });
    } catch (error) {
        console.error('Lỗi cập nhật tài khoản:', error);
    res.status(500).json({ message: 'Lỗi máy chủ.', error: error.message });
    }
}

module.exports.deleteAccount = async(req, res) => {
    try {
        const id = req.params.id;
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        await Account.updateOne({
            _id: id
        }, {
            deleted: true
        })

        res.status(200).json({ message: 'Xóa tài khoản thành công.' });

    } catch (error) {
        console.error('Lỗi xóa tài khoản:', error);
        res.status(500).json({ message: 'Lỗi máy chủ.', error: error.message });
    }
}

module.exports.detailAccount = async(req, res) => {
    try {
        const id = req.params.id;

        const account = await Account.findOne({
            _id: id,
            deleted: false,
        })

         res.status(200).json({
            message: "Lấy ra account thành công!",
            data: account
        })
    } catch (error) {
        console.error('Lỗi xóa tài khoản:', error);
        res.status(500).json({ message: 'Lỗi máy chủ.', error: error.message });
    }
}

module.exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
        }

        const account = await Account.findOne({ email });
        if (!account) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Trả về thành công
        res.status(200).json({
        message: 'Đăng nhập thành công.',
        account: {
            id: account._id,
            name: account.name,
            email: account.email,
            status: account.status
        }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi máy chủ.', error: error.message });
    }

}
