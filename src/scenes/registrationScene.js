const { Scenes } = require("telegraf");
const User = require("../models/User");
const { getMainMenu } = require("../keyboards/mainMenu");

const registrationScene = new Scenes.WizardScene(
    "registrationScene",
    async (ctx) => {
        const foundUser = await User.findOne({ telegramId: ctx.from.id });
        if (foundUser) {
            await ctx.reply(ctx.t("messages.registration.already_registered_welcome"), getMainMenu(ctx));
            ctx.session.name = foundUser.name;
            return ctx.scene.leave();
        }
        await ctx.reply(ctx.t("messages.registration.enter_name"));
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.session.name = ctx.message.text;
        await ctx.reply(ctx.t("messages.registration.enter_phone"), {
            reply_markup: {
                keyboard: [[{ text: ctx.t("messages.registration.share_phone"), request_contact: true }]],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        });
        return ctx.wizard.next();
    },
    async (ctx) => {
        const contact = ctx.message.contact || ctx.message.text;
        if (!contact) return ctx.reply(ctx.t("messages.registration.invalid_phone"));

        const newUser = new User({
            telegramId: ctx.from.id,
            name: ctx.session.name,
            phone: contact.phone_number || contact,
        });

        await newUser.save();
        await ctx.reply(ctx.t("messages.registration.success"), getMainMenu(ctx));
        return ctx.scene.leave();
    }
);

module.exports = { registrationScene };
