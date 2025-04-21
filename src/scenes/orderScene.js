const { Scenes } = require("telegraf");
const Order = require("../models/Order");
const { getMainMenu } = require("../keyboards/mainMenu");
const deletePreviousMessage = require("../services/deletePreviousMessage");

const orderScene = new Scenes.WizardScene("orderScene", async (ctx) => {
    const orders = await Order.find({ userId: ctx.from.id });
    await deletePreviousMessage(ctx);

    if (orders.length === 0) {
        ctx.reply(ctx.t("messages.orders_empty"), getMainMenu(ctx));
        return ctx.scene.leave();
    }

    const ordersMessage = () => {
        if (ctx.locale === "ru") {
            let orderText = "📦 Ваши заказы:\n\n";
            orders.forEach((order, index) => {
                orderText += `${index + 1}. Заказ #${order._id}\nСтатус: ${order.status}\n\n`;
            });
            return orderText;
        } else if (ctx.locale === "uz") {
            let orderText = "📦 Buyurtmalaringiz:\n\n";
            orders.forEach((order, index) => {
                orderText += `${index + 1}. Buyurtma #${order._id}\nHolati: ${order.status}\n\n`;
            });
            return orderText;
        }
    }

    await ctx.reply(ordersMessage(), getMainMenu(ctx));
    return ctx.scene.leave();
});

module.exports = { orderScene };
