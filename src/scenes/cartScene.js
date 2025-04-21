const { Scenes } = require("telegraf");
const Cart = require("../models/Cart");
const { getMainMenu } = require("../keyboards/mainMenu");
const deletePreviousMessage = require("../services/deletePreviousMessage");


const cartScene = new Scenes.WizardScene("cartScene", async (ctx) => {
    await deletePreviousMessage(ctx)
    const cartItems = await Cart.find({ userId: ctx.from.id }).populate("items.productId");
    console.log(cartItems);

    if (cartItems.length === 0 || !cartItems[0]) {
        const sentMessage = await ctx.reply(ctx.t("messages.cart_empty"), getMainMenu(ctx));
        ctx.session.lastMessageId = sentMessage.message_id;
        return ctx.scene.leave();
    }

    const cartMessage = () => {
        if (ctx.i18n.locale === "ru") {
            let cartText = "🛒 Ваша корзина:\n\n";
            cartItems[0].items.forEach((item, index) => {
                cartText += `${index + 1}. ${item.productId.name} - ${item.quantity} шт.\n`;
            });
            console.log(cartText);
            return cartText;
        } else if (ctx.i18n.locale === "uz") {
            let cartText = "🛒 Sizning savat:\n\n";
            cartItems[0].items.forEach((item, index) => {
                cartText += `${index + 1}. ${item.productId.name} - ${item.quantity} dona.\n`;
            });
            return cartText;
        }
    };

    const sentMessage = await ctx.reply(cartMessage(), getMainMenu(ctx));
    ctx.session.lastMessageId = sentMessage.message_id;
    return ctx.scene.leave();
});

module.exports = { cartScene };
