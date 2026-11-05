var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/User");

const auth = require("../../middleware/token.middleware");
const isAdmin = require("../../middleware/admin.middleware");

/* Admin section Approve */
router.put("/:id/approve", auth, isAdmin, async(req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true }
    );
    if (!user) return res.status(400).json({ status: 400,message: "ไม่พบผู้ใช้งาน" });
    res.status(200).json({status: 200,message: "Approved ผู้ใช้งานแล้ว",user});
  } catch (error) {
    res.status(500).json({ status: 500, message: "เกิดข้อผิดพลาดในการ Approve ผู้ใช้งาน" });
  }
});

module.exports = router;
