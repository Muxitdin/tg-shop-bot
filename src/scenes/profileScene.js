const { Scenes } = require("telegraf");
const User = require("../models/User");
const { mainMenu } = require('../keyboards/mainMenu');

const profileScene = new Scenes.WizardScene("profileScene", async (ctx) => {
    const user = await User.findOne({ telegramId: ctx.from.id });

    if (!user) {
        ctx.reply("❌ Ошибка! Вы не зарегистрированы.", mainMenu);
        return ctx.scene.leave();
    }

    await ctx.reply(`👤 Ваш профиль:\n\nИмя: ${user.name}\nТелефон: ${user.phone}\nЯзык: ${user.language}`, mainMenu);
    return ctx.scene.leave();
});

module.exports = { profileScene };
