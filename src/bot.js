const { Telegraf, Scenes, session } = require("telegraf");
const { mainMenu } = require("./keyboards/mainMenu.js");
const { registrationScene } = require("./scenes/registrationScene.js");
const { settingsScene } = require("./scenes/settingsScene.js");
const { profileScene } = require("./scenes/profileScene.js");
const { cartScene } = require("./scenes/cartScene.js");
const { orderScene } = require("./scenes/orderScene.js");
const languageMiddleware = require("./middlewares/languageMiddleware.js");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Создаём менеджер сцен
const stage = new Scenes.Stage([registrationScene, settingsScene, profileScene, cartScene, orderScene]);

// Middlewares
bot.use(session());
bot.use(stage.middleware());
// bot.use(languageMiddleware);

// Стартовая команда
bot.start(async (ctx) => {
    await ctx.scene.enter("registrationScene");
});


// Главное меню
bot.hears('📋 Меню', async (ctx) => {
    await ctx.reply('Выберите действие:', mainMenu);
});

// Команды для перехода по сценам
bot.hears("⚙️ Настройки", (ctx) => ctx.scene.enter("settingsScene"));
bot.hears("👤 Мой профиль", (ctx) => ctx.scene.enter("profileScene"));
bot.hears("🛒 Корзина", (ctx) => ctx.scene.enter("cartScene"));
bot.hears("📦 Мои заказы", (ctx) => ctx.scene.enter("orderScene"));

// Перехват неизвестных команд и отображение меню
bot.on('message', async (ctx) => {
    await ctx.reply('Выберите действие:', mainMenu);
});

module.exports = bot;
