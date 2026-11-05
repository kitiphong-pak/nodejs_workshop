var express = require("express");
var router = express.Router();
var UserSchema = require("../../models/User");
var bcrypt = require("bcrypt");

router.post("/", async (req, res, next) => {
  try {
    const { username, password, name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({ status: 400,message: "กรุณากรอกข้อมูลให้ครบถ้วน" });

    const userExist = await UserSchema.findOne({ username });
    if (userExist)
      return res.status(400).json({ status: 400, message: "มี username อยู่ในระบบอยู่แล้ว" });

    let user = new UserSchema({
      username,
      password: await bcrypt.hash(password, 10),
      name,
      email,
    });
    await user.save();
    return res.status(201).json({ status: 201,message: "ลงทะเบียนสำเร็จ",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({status: 500, message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
  }
});

module.exports = router;
