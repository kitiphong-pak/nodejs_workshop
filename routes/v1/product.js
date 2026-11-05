var express = require('express');
var router = express.Router();
var Product = require("../../models/Product");
var Order = require("../../models/Order");
var User = require("../../models/User");

router.get('/', async (req, res, next) => {
    try {
        let products = await Product.find({});
        res.status(200).json({status: 200,message: 'ดึงข้อมูลสินค้าสำเร็จ',products});
    } catch (error) {
        res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า'});
    }
}); 

router.get('/:id', async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400) .json({ status: 400, message: 'ไม่พบสินค้า' });
        }
        res.status(200).json({status: 200, message: 'ดึงข้อมูลสินค้าสำเร็จ',product});
    } catch (error) {
        res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { name, price, description, stock } = req.body;
        if (!name || !price || stock === undefined) {
            return res.status(400) .json({ status: 400, message: 'กรุณากรอกข้อมูลสินค้าให้ครบถ้วน' });
        }
        if (price < 0 || stock < 0) {
            return res.status(400).json({ status: 400, message: 'ราคาสินค้าและจำนวนสินค้าไม่สามารถเป็นค่าลบได้'});
        }
        if(await Product.findOne({ name })) {
            return res.status(400).json({ status: 400, message: 'มีสินค้านี้อยู่แล้ว' });
        }
        let product =await new Product({
            name,
            price,
            description,
            stock,
        });
        await product.save();
        res.status(201).json({ status: 201, message: 'เพิ่มสินค้าเรียบร้อยแล้ว', product });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' });
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { name, price, description, stock } = req.body;
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ status: 400, message: 'ไม่พบสินค้า' });
        }

        let updateData = {};
        if (name) updateData.name = name;
        if (price !== undefined) updateData.price = price;
        if (description) updateData.description = description;
        if (stock !== undefined) updateData.stock = stock;

        await Product.findByIdAndUpdate(id, updateData);
        res.status(200).json({ status: 200, message: 'แก้ไขสินค้าเรียบร้อยแล้ว', product });

    }catch (error) {
        res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการแก้ไขสินค้า' });
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 200, message: 'ลบสินค้าเรียบร้อยแล้ว', product });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการลบสินค้า' });
    }
});

router.post('/:id/orders', async (req, res, next) => {
    try {
        const quantity = Number(req.body.quantity);
        if (!quantity || quantity <= 1) {
            return res.status(400) .json({ status: 400,  message: 'กรุณากรอกจำนวนสินค้า' });
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).json({ status: 400, message: 'ไม่พบสินค้า'  });
        }
        if (product.stock < quantity) {
            return res.status(400) .json({ status: 400,  message: 'สินค้าไม่เพียงพอ' });
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(400).json({ status: 400, message: 'ไม่พบผู้ใช้' });
        }
        let order = new Order({
            users : [{
                userId: user._id,
                name: user.name,
                email: user.email,
            }],
            products: [{
                productId: product._id,
                pname: product.name,
                price: product.price,
            }],
            quantity,
            totalPrice: product.price * quantity,
            
        });
        await order.save();
        await Product.updateOne({ _id: req.params.id }, { $inc: { stock: -quantity } });
        res.status(201).json({ status: 201, message: 'สร้างคำสั่งซื้อเรียบร้อยแล้ว', order });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ' });
    }
});

router.get('/:id/orders', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).json({ status: 400, message: 'ไม่พบสินค้า' });
        }
        let orders = await Order.find({ "products.productId": req.params.id });
        res.status(200).json({ status: 200, message: `คำสั่งซื้อ${product.name} ${orders.length} รายการ`, orders });
    }catch (error) {
        res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});


module.exports = router;