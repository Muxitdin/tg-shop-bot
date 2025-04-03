const { Scenes, Markup } = require("telegraf");
const User = require("../models/User");
const { mainMenu } = require("../keyboards/mainMenu");
const { settingsMenu } = require("../keyboards/settingsMenu");

const settingsScene = new Scenes.BaseScene("settingsScene");

settingsScene.enter(async (ctx) => {
    await ctx.reply("Выберите язык:", settingsMenu);
});
settingsScene.on("text", async (ctx) => {
    const text = ctx.message.text;

    if (text === "🇷🇺 Русский") {
        await User.updateOne({ telegramId: ctx.from.id }, { language: "ru" });
        await ctx.reply("Язык изменен на русский.", Markup.removeKeyboard());
    } else if (text === "🇺🇿 Oʻzbekcha") {
        await User.updateOne({ telegramId: ctx.from.id }, { language: "uz" });
        await ctx.reply("Til o‘zbek tiliga o‘zgartirildi.", Markup.removeKeyboard());
    } else {
        await ctx.reply("Пожалуйста, выберите язык с клавиатуры.");
    }

    // Возвращаем главное меню после выбора языка
    await ctx.reply("Выберите действие:", mainMenu);
    return ctx.scene.leave();
});

module.exports = { settingsScene };
