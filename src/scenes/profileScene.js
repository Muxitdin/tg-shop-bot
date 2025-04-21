const { Scenes } = require("telegraf");
const User = require("../models/User");
const { getMainMenu } = require("../keyboards/mainMenu");
const deletePreviousMessage = require("../services/deletePreviousMessage");

const profileScene = new Scenes.WizardScene("profileScene", async (ctx) => {
    const user = await User.findOne({ telegramId: ctx.from.id });
    await deletePreviousMessage(ctx);

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

    const sentMessage = await ctx.reply(profileMessage(), getMainMenu(ctx));
    ctx.session.lastMessageId = sentMessage.message_id;
    return ctx.scene.leave();
});

module.exports = { profileScene };
