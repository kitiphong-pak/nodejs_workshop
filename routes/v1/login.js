var express = require("express");
var router = express.Router();
var UserSchema = require("../../models/User");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 400, message: "กรุณากรอก username และ password" });
    }

    const user = await UserSchema.findOne({ username });
    if (!user) {
      return res.status(400).json({ status: 400, message: "username  ไม่ถูกต้อง" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 400, message: "password ไม่ถูกต้อง" });
    }

    if (!user.approved) {
      return res.status(400).json({ status: 400, message: "บัญชีคุณยังไม่ถูก Approve" });
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "6h" });

    return res.json({
      status: 200, message: "Login success",token: token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "เกิดข้อผิดพลาดในการ Login" });
  }
});

module.exports = router;
