const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        telegramId: { type: String, required: true, unique: true },
        name: String,
        phone: String,
        language: { type: String, default: 'uz', enum: ['ru', 'uz'] },
        registeredAt: { type: Date, default: Date.now() },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
