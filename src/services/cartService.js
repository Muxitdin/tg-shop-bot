const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const User = require('../models/User');

const cartService = {
    // Get or create cart for user
    getOrCreateCart: async (userId) => {
        try {
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                const foundUser = await User.find({ telegramId: userId });
                console.log("🚀 ~ getOrCreateCart: ~ foundUser:", foundUser)

                cart = new Cart({
                    owner: foundUser[0]._id,
                    userId,
                    items: [],
                });
                await cart.save();
            }

            return cart;
        } catch (error) {
            console.error(`Error getting cart for user ${userId}:`, error);
            throw error;
        }
    },

    // Add item to cart
    addItem: async (userId, productId, quantity = 1) => {
        try {
            // Check if product exists and has enough stock
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            if (product.stock < quantity) {
                throw new Error("Not enough stock");
            }

            // Get or create cart
            const cart = await cartService.getOrCreateCart(userId);

            // Check if product already in cart
            const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({
                    productId: new mongoose.Types.ObjectId(productId),
                    quantity,
                });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error(`Error adding item to cart for user ${userId}:`, error);
            throw error;
        }
    },

    // Get cart with populated product data
    getCartWithProducts: async (userId) => {
        try {
            const cart = await Cart.findOne({ userId }).populate("items.productId");

            if (!cart) {
                return { items: [] };
            }

            return cart;
        } catch (error) {
            console.error(`Error getting cart with products for user ${userId}:`, error);
            throw error;
        }
    },

    // Clear cart
    clearCart: async (userId) => {
        try {
            const cart = await Cart.findOne({ userId });

            if (cart) {
                cart.items = [];
                await cart.save();
            }

            return { success: true };
        } catch (error) {
            console.error(`Error clearing cart for user ${userId}:`, error);
            throw error;
        }
    },
};

module.exports = cartService;
