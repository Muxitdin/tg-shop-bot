const { Scenes } = require("telegraf");
const User = require("../models/User");
const { mainMenu } = require('../keyboards/mainMenu');

const registrationScene = new Scenes.WizardScene(
    "registrationScene",
    async (ctx) => {
        await ctx.reply("Введите ваше имя:");
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.session.name = ctx.message.text;
        await ctx.reply("Отправьте ваш номер телефона (или поделитесь контактом):", {
            reply_markup: {
                keyboard: [[{ text: "📱 Отправить контакт", request_contact: true }]],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        });
        return ctx.wizard.next();
    },
    async (ctx) => {
        const contact = ctx.message.contact || ctx.message.text;
        if (!contact) return ctx.reply("Пожалуйста, отправьте корректный номер телефона.");

        const newUser = new User({
            telegramId: ctx.from.id,
            name: ctx.session.name,
            phone: contact.phone_number || contact,
        });

        await newUser.save();
        await ctx.reply("✅ Регистрация завершена! Теперь вы можете пользоваться ботом.", mainMenu);
        return ctx.scene.leave();
    }
);

module.exports = { registrationScene };
