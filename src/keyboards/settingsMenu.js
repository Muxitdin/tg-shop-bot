const { Markup } = require("telegraf");

const settingsMenu = Markup.keyboard([
    ["🇷🇺 Русский", "🇺🇿 Oʻzbekcha"]
]).resize();

module.exports = { settingsMenu };
