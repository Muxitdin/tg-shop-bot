const { Markup } = require('telegraf');

function getSettingsMenu(ctx) {
    return Markup.keyboard([["🇷🇺 Русский", "🇺🇿 Oʻzbekcha"], [ctx.t("buttons.back")]]).resize();
}

module.exports = { getSettingsMenu };
