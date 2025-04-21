const { Scenes, Markup } = require("telegraf");
const { getMainMenu } = require("../keyboards/mainMenu");
const categoriesService = require("../services/categoriesService");
const productsService = require("../services/productsService");
const cartService = require("../services/cartService");
const User = require("../models/User");
const deletePreviousMessage = require("../services/deletePreviousMessage");

// Items per page for pagination
const ITEMS_PER_PAGE = 5;

const purchaseScene = new Scenes.BaseScene("purchaseScene");

// Scene enter handler
purchaseScene.enter(async (ctx) => {
    // Reset pagination state when entering the scene
    ctx.session.categoryPage = 0;
    ctx.session.productPage = 0;
    ctx.session.selectedCategory = null;
    await ctx.reply( ctx.t("messages.purchase.purchase_scene_on"),{
        reply_markup: {
            remove_keyboard: true,
        },
    });

    await showCategories(ctx);
});

// Function to display categories with pagination
async function showCategories(ctx) {
    await deletePreviousMessage(ctx);
    const page = ctx.session.categoryPage || 0;

    // Get all categories
    const categories = await categoriesService.getAll();

    if (categories.length === 0) {
        const sentMessage = await ctx.reply(ctx.t("messages.purchase.no_categories"), getMainMenu(ctx));
        ctx.session.lastMessageId = sentMessage.message_id;
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const startIdx = page * ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, categories.length);
    const currentPageCategories = categories.slice(startIdx, endIdx);

    // Create keyboard with categories
    const keyboard = [];

    // Add category buttons
    currentPageCategories.forEach((category) => {
        keyboard.push([Markup.button.callback(category.name, `category:${category._id}`)]);
    });

    // Add pagination controls
    const paginationRow = [];
    if (page > 0) {
        paginationRow.push(Markup.button.callback("⬅️", "categories:prev"));
    }
    if (page < totalPages - 1) {
        paginationRow.push(Markup.button.callback("➡️", "categories:next"));
    }

    if (paginationRow.length > 0) {
        keyboard.push(paginationRow);
    }

    // Add back button
    keyboard.push([Markup.button.callback(ctx.t("buttons.back_to_menu"), "back_to_menu")]);

    const message = ctx.t("messages.purchase.select_category") + `\n(${ctx.t("messages.purchase.page")} ${page + 1}/${totalPages})`;

    const sentMessage = await ctx.reply(message, Markup.inlineKeyboard(keyboard));
    ctx.session.lastMessageId = sentMessage.message_id;
}

// Function to display products from a category with pagination
async function showProducts(ctx, categoryId) {
    await deletePreviousMessage(ctx);

    const page = ctx.session.productPage || 0;

    // Get products for the selected category
    const products = await productsService.getByCategoryId(categoryId);
    if (products.length === 0) {
        const sentMessage = await ctx.reply(
            ctx.t("messages.purchase.no_products_in_category"),
            Markup.inlineKeyboard([[Markup.button.callback(ctx.t("buttons.back_to_categories"), "back_to_categories")]])
        );
        ctx.session.lastMessageId = sentMessage.message_id;
        return
    }

    // Calculate pagination
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIdx = page * ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, products.length);
    const currentPageProducts = products.slice(startIdx, endIdx);

    // Create keyboard with products
    const keyboard = [];

    // Add product buttons
    currentPageProducts.forEach((product) => {
        keyboard.push([Markup.button.callback(`${product.name} - ${product.price}`, `product:${product.id}`)]);
    });

    // Add pagination controls
    const paginationRow = [];
    if (page > 0) {
        paginationRow.push(Markup.button.callback("⬅️", "products:prev"));
    }
    if (page < totalPages - 1) {
        paginationRow.push(Markup.button.callback("➡️", "products:next"));
    }

    if (paginationRow.length > 0) {
        keyboard.push(paginationRow);
    }

    // Add back button
    keyboard.push([Markup.button.callback(ctx.t("buttons.back_to_categories"), "back_to_categories")]);
    keyboard.push([Markup.button.callback(ctx.t("buttons.back_to_menu"), "back_to_menu")]);


    // Get category name
    const category = await categoriesService.getById(categoryId);

    const message =
        `${ctx.t("messages.purchase.category")}: ${category.name}\n` +
        `${ctx.t("messages.purchase.select_product")}\n` +
        `(${ctx.t("messages.purchase.page")} ${page + 1}/${totalPages})`;

    const sentMessage = await ctx.reply(message, Markup.inlineKeyboard(keyboard));
    ctx.session.lastMessageId = sentMessage.message_id;
}

// Function to show product details
async function showProductDetails(ctx, productId) {
    await deletePreviousMessage(ctx);
    // Get product details
    const product = await productsService.getById(productId);

    if (!product) {
        const sentMessage = await ctx.reply(ctx.t("messages.purchase.product_not_found"));
        ctx.session.lastMessageId = sentMessage.message_id;
    }

    // Create message with product details
    let message = `*${product.name}*\n`;
    message += `${ctx.t("messages.purchase.price")}: ${product.price}\n`;

    if (product.stock > 0) {
        message += `${ctx.t("messages.purchase.in_stock")}: ${product.stock}\n`;
    } else {
        message += `${ctx.t("messages.purchase.out_of_stock")}\n`;
    }

    message += `${ctx.t("messages.purchase.description")}: ${product.description}\n`;

    // Escape special Markdown characters
    message = message.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");

    // Create keyboard
    const keyboard = [[Markup.button.callback(ctx.t("buttons.back_to_products"), "back_to_products")]];

    // Only show add to cart button if in stock
    if (product.stock > 0) {
        keyboard.unshift([Markup.button.callback(ctx.t("buttons.add_to_cart"), `add_to_cart:${productId}`)]);
    }

    // Add image if available
    if (product.image) {
        try {
            const sentMessage = await ctx.replyWithPhoto(product.image, {
                caption: message,
                parse_mode: "MarkdownV2",
                ...Markup.inlineKeyboard(keyboard),
            });
            ctx.session.lastMessageId = sentMessage.message_id;
        } catch (error) {
            console.error("Error sending product image:", error);
            // Fallback to text if image fails
            const sentMessage = await ctx.replyWithMarkdownV2(message, Markup.inlineKeyboard(keyboard));
            ctx.session.lastMessageId = sentMessage.message_id;
        }
    } else {
        const sentMessage = await ctx.replyWithMarkdownV2(message, Markup.inlineKeyboard(keyboard));
        ctx.session.lastMessageId = sentMessage.message_id;
    }
}

// Handle category selection
purchaseScene.action(/^category:(.+)$/, async (ctx) => {
    const categoryId = ctx.match[1];
    ctx.session.selectedCategory = categoryId;
    ctx.session.productPage = 0; // Reset product pagination

    await ctx.answerCbQuery();
    await showProducts(ctx, categoryId);
});

// Handle product selection
purchaseScene.action(/^product:(.+)$/, async (ctx) => {
    const productId = ctx.match[1];

    await ctx.answerCbQuery();
    await showProductDetails(ctx, productId);
});

// Add product to cart
purchaseScene.action(/^add_to_cart:(.+)$/, async (ctx) => {
    const productId = ctx.match[1];
    const userId = ctx.from.id.toString();

    try {
        // Add to cart
        await cartService.addItem(userId, productId, 1);
        await ctx.answerCbQuery(ctx.t("messages.purchase.added_to_cart"));

        await deletePreviousMessage(ctx);
        // Go back to products
        await showProducts(ctx, ctx.session.selectedCategory);
    } catch (error) {
        console.error("Error adding to cart:", error);

        if (error.message === "Not enough stock") {
            await ctx.answerCbQuery(ctx.t("errors.not_enough_stock"));
        } else {
            await ctx.answerCbQuery(ctx.t("errors.add_to_cart_failed"));
        }
    }
});

// Categories pagination
purchaseScene.action("categories:next", async (ctx) => {
    ctx.session.categoryPage = (ctx.session.categoryPage || 0) + 1;
    await ctx.answerCbQuery();
    await showCategories(ctx);
});

purchaseScene.action("categories:prev", async (ctx) => {
    ctx.session.categoryPage = Math.max(0, (ctx.session.categoryPage || 0) - 1);
    await ctx.answerCbQuery();
    await showCategories(ctx);
});

// Products pagination
purchaseScene.action("products:next", async (ctx) => {
    ctx.session.productPage = (ctx.session.productPage || 0) + 1;
    await ctx.answerCbQuery();
    await showProducts(ctx, ctx.session.selectedCategory);
});

purchaseScene.action("products:prev", async (ctx) => {
    ctx.session.productPage = Math.max(0, (ctx.session.productPage || 0) - 1);
    await ctx.answerCbQuery();
    await showProducts(ctx, ctx.session.selectedCategory);
});

// Back to categories
purchaseScene.action("back_to_categories", async (ctx) => {
    ctx.session.selectedCategory = null;
    await ctx.answerCbQuery();
    await showCategories(ctx);
});

// Back to products
purchaseScene.action("back_to_products", async (ctx) => {
    await ctx.answerCbQuery();
    await showProducts(ctx, ctx.session.selectedCategory);
});

// Go back to main menu
purchaseScene.action("back_to_menu", async (ctx) => {
    await deletePreviousMessage(ctx);
    await ctx.answerCbQuery();
    await ctx.reply(ctx.t("messages.purchase.back_to_menu"), getMainMenu(ctx));
    await ctx.scene.leave();
});

module.exports = { purchaseScene };
