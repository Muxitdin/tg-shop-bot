const { Scenes } = require("telegraf");
const User = require("../models/User");
const { getMainMenu } = require("../keyboards/mainMenu");

const profileScene = new Scenes.WizardScene("profileScene", async (ctx) => {
    const user = await User.findOne({ telegramId: ctx.from.id });

    if (!user) {
        ctx.reply(ctx.t("messages.profile.not_registered"), getMainMenu(ctx));
        return ctx.scene.leave();
    }

    const profileMessage = () => {
        return ctx.t("messages.profile.message", {
            name: user.name,
            phone: user.phone,
            language: user.language,
        });
    };

    await ctx.reply(profileMessage(), getMainMenu(ctx));
    return ctx.scene.leave();
});

module.exports = { profileScene };
