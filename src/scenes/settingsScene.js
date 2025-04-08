const { Scenes } = require("telegraf");
const User = require("../models/User");
const { getMainMenu } = require("../keyboards/mainMenu");
const { getSettingsMenu } = require("../keyboards/settingsMenu");

const settingsScene = new Scenes.BaseScene("settingsScene");

settingsScene.enter(async (ctx) => {
    await ctx.reply(ctx.t("messages.choose_language"), getSettingsMenu(ctx));
});

settingsScene.hears("🇷🇺 Русский", async (ctx) => {
    await User.findOneAndUpdate({ telegramId: ctx.from.id }, { language: "ru" }, { upsert: true });

    // Update session language
    ctx.i18n.setLocale("ru");

    await ctx.reply(ctx.t("messages.language_changed"));
    await ctx.reply(ctx.t("messages.choose_action"), getMainMenu(ctx));
});

settingsScene.hears("🇺🇿 Oʻzbekcha", async (ctx) => {
    await User.findOneAndUpdate({ telegramId: ctx.from.id }, { language: "uz" }, { upsert: true });

    // Update session language
    ctx.i18n.setLocale("uz");

    await ctx.reply(ctx.t("messages.language_changed"));
    await ctx.reply(ctx.t("messages.choose_action"), getMainMenu(ctx));
});

settingsScene.hears(/⬅️ Назад|⬅️ Orqaga/, (ctx) => {
    ctx.scene.leave();
    ctx.reply(ctx.t("messages.choose_action"), getMainMenu(ctx));
});

module.exports = { settingsScene };
