const { Markup } = require("telegraf");

function getMainMenu(ctx, language = "ru") {
    return Markup.keyboard([
        [ctx.t("buttons.cart"), ctx.t("buttons.orders")],
        [ctx.t("buttons.settings"), ctx.t("buttons.profile")],
        [ctx.t("buttons.purchase")],
    ]).resize();
}

module.exports = { getMainMenu };
