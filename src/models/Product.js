const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        image: String,
        price: { type: Number, required: true },
        category: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
