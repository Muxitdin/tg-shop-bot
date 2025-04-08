const { Telegraf, Scenes, session } = require("telegraf");
const { getMainMenu } = require("./keyboards/mainMenu.js");
const { registrationScene } = require("./scenes/registrationScene.js");
const { settingsScene } = require("./scenes/settingsScene.js");
const { profileScene } = require("./scenes/profileScene.js");
const { cartScene } = require("./scenes/cartScene.js");
const { orderScene } = require("./scenes/orderScene.js");
const languageMiddleware = require("./middlewares/languageMiddleware.js");
const checkIfPrivateChat = require('./middlewares/checkIfPrivateChat.js');
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Создаём менеджер сцен
const stage = new Scenes.Stage([registrationScene, settingsScene, profileScene, cartScene, orderScene]);

// Middlewares
stage.use(languageMiddleware); // this will allow language middleware be available inside the scenes
bot.use(checkIfPrivateChat);
bot.use(session());
bot.use(stage.middleware());
bot.use(languageMiddleware);

// Стартовая команда
bot.start(async (ctx) => {
    await ctx.scene.enter("registrationScene");
});

// Главное меню
bot.hears([/📋 Меню/i, /📋 Menyu/i], async (ctx) => {
    await ctx.reply(ctx.t("messages.choose_action"), getMainMenu(ctx));
});

// Команды для перехода по сценам
bot.hears([/⚙️ Настройки/i, /⚙️ Sozlamalar/i], (ctx) => ctx.scene.enter("settingsScene"));
bot.hears([/👤 Мой профиль/i, /👤 Mening profilim/i], (ctx) => ctx.scene.enter("profileScene"));
bot.hears([/🛒 Корзина/i, /🛒 Savatcha/i], (ctx) => ctx.scene.enter("cartScene"));
bot.hears([/📦 Мои заказы/i, /📦 Buyurtmalarim/i], (ctx) => ctx.scene.enter("orderScene"));

// Перехват неизвестных команд и отображение меню
bot.on("message", async (ctx) => {
    await ctx.reply(ctx.t("messages.choose_action"), getMainMenu(ctx));
});

module.exports = bot;
