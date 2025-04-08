const { Scenes } = require("telegraf");
const Cart = require("../models/Cart");
const { getMainMenu } = require("../keyboards/mainMenu");

const cartScene = new Scenes.WizardScene("cartScene", async (ctx) => {
    const cartItems = await Cart.find({ userId: ctx.from.id });

    if (cartItems.length === 0) {
        ctx.reply(ctx.t("messages.cart_empty"), getMainMenu(ctx));
        return ctx.scene.leave();
    }

    let cartText = "🛒 Ваша корзина:\n\n";
    cartItems.forEach((item, index) => {
        cartText += `${index + 1}. ${item.productName} - ${item.quantity} шт.\n`;
    });
    const cartMessage = () => {
        if (ctx.locale === "ru") {
            let cartText = "🛒 Ваша корзина:\n\n";
            cartItems.forEach((item, index) => {
                cartText += `${index + 1}. ${item.productName} - ${item.quantity} шт.\n`;
            });
            return cartText;
        } else if (ctx.locale === "uz") {
            let cartText = "🛒 Sizning savat:\n\n";
            cartItems.forEach((item, index) => {
                cartText += `${index + 1}. ${item.productName} - ${item.quantity} dona.\n`;
            });
            return cartText;
        }
    };

    await ctx.reply(cartMessage(), getMainMenu(ctx));
    return ctx.scene.leave();
});

module.exports = { cartScene };
