const { Scenes } = require("telegraf");
const Order = require("../models/Order");
const { mainMenu } = require('../keyboards/mainMenu');

const orderScene = new Scenes.WizardScene("orderScene", async (ctx) => {
    const orders = await Order.find({ userId: ctx.from.id });

    if (orders.length === 0) {
        ctx.reply("📦 У вас пока нет заказов.", mainMenu);
        return ctx.scene.leave();
    }

    let orderText = "📦 Ваши заказы:\n\n";
    orders.forEach((order, index) => {
        orderText += `${index + 1}. Заказ #${order._id}\nСтатус: ${order.status}\n\n`;
    });

    await ctx.reply(orderText, mainMenu);
    return ctx.scene.leave();
});

module.exports = { orderScene };
