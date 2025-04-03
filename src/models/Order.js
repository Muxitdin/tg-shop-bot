const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
        status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered"], default: "pending" },
        totalPrice: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
