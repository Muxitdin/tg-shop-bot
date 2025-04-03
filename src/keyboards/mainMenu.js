const { Markup } = require("telegraf");

const mainMenu = Markup.keyboard([
    ["🛒 Корзина", "📦 Мои заказы"],
    ["⚙️ Настройки", "👤 Мой профиль"],
    ["🛍️ Создать заказ"],
]).resize();

module.exports = { mainMenu };
