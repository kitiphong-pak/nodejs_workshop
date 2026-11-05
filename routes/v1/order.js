var express = require('express');
var router = express.Router();
var Order = require('../../models/Order');

router.get('/', async (req, res, next) => {
    try {
        let orders = await Order.find({});
        res.status(200).json({ status: 200, message: 'ดึงข้อมูลคำสั่งซื้อสำเร็จ', orders });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});

module.exports = router;