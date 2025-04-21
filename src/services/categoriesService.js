const Category = require('../models/Category');
const Product = require("../models/Product");

const categoriesService = {
    // Get all unique categories
    getAll: async () => {
        try {
            const categories = await Category.find();
            console.log("🚀 ~ getAll: ~ categories:", categories)

            return categories;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    },

    // Get category by ID
    getById: async (id) => {
        try {
            const category = await Category.findById(id);
            if (!category) return null;

            return category;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            return null;
        }
    },
};

module.exports = categoriesService;
