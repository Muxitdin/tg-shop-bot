const { Scenes } = require("telegraf");
const Cart = require("../models/Cart");
const { mainMenu } = require("../keyboards/mainMenu");

const cartScene = new Scenes.WizardScene("cartScene", async (ctx) => {
    const cartItems = await Cart.find({ userId: ctx.from.id });

    if (cartItems.length === 0) {
        ctx.reply("🛒 Ваша корзина пуста.", mainMenu);
        return ctx.scene.leave();
    }

    let cartText = "🛒 Ваша корзина:\n\n";
    cartItems.forEach((item, index) => {
        cartText += `${index + 1}. ${item.productName} - ${item.quantity} шт.\n`;
    });

    await ctx.reply(cartText, mainMenu);
    return ctx.scene.leave();
});

module.exports = { cartScene };
