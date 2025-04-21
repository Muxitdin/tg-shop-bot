const { Scenes } = require("telegraf");
const User = require("../models/User");
const { getMainMenu } = require("../keyboards/mainMenu");
const { getSettingsMenu } = require("../keyboards/settingsMenu");
const deletePreviousMessage = require("../services/deletePreviousMessage");

const settingsScene = new Scenes.BaseScene("settingsScene");

settingsScene.enter(async (ctx) => {
    await deletePreviousMessage(ctx)
    await ctx.reply(ctx.t("messages.choose_language"), getSettingsMenu(ctx));
});

settingsScene.hears("🇷🇺 Русский", async (ctx) => {
    const existingUser = await User.findOne({ telegramId: ctx.from.id });
    if (existingUser) {
        await User.findByIdAndUpdate(existingUser._id, { language: "ru" });
    } else {
        return ctx.reply(ctx.t("messages.registration.error"));
    }
    // Update session language
    ctx.i18n.setLocale("ru");

    await ctx.reply(ctx.t("messages.language_changed"));
    await ctx.reply(ctx.t("messages.choose_action"), getMainMenu(ctx));
});

settingsScene.hears("🇺🇿 Oʻzbekcha", async (ctx) => {
    const existingUser = await User.findOne({ telegramId: ctx.from.id });
    if (existingUser) {
        await User.findByIdAndUpdate(existingUser._id, { language: "uz" });
    } else {
        return ctx.reply(ctx.t("messages.registration.error"));
    }

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
