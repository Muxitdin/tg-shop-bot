const Product = require("../models/Product");
const mongoose = require("mongoose");

const productsService = {
    // Get products by category
    getByCategoryId: async (categoryId) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                console.log("ERROR ~ getByCategoryId: ~ Invalid categoryId: ", categoryId)
                return [];
            }

            const products = await Product.find({ category: categoryId });

            // Transform to the format needed by the bot
            return products.map((product) => ({
                id: product._id.toString(),
                name: product.name,
                price: `${product.price}$`,
                description: product.description,
                image: product.image,
                stock: product.stock,
            }));
        } catch (error) {
            console.error(`Error fetching products for category ${categoryId}:`, error);
            return [];
        }
    },

    // Get product by ID
    getById: async (id) => {
        try {
            // Check if ID is valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }

            const product = await Product.findById(id);

            if (!product) {
                return null;
            }

            return {
                id: product._id.toString(),
                name: product.name,
                price: `${product.price}$`,
                description: product.description,
                image: product.image,
                stock: product.stock,
            };
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
        }
    },
};

module.exports = productsService;
