const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        users: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                name: { type: String, required: true },
                email: { type: String, required: true },
                _id: false
            },
        ],
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                pname: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
                _id: false
            },
        ],
        quantity: { type: Number, required: true, min: 1 },
        totalPrice: { type: Number, required: true, min: 0 },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
