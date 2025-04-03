const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bot = require("./src/bot");

const app = express();
// Webhook URL для бота
app.use(bot.webhookCallback("/webhook"));

app.get("/", (req, res) => {
    res.send("🤖 Telegram Bot Server is running!");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");

        try {
            const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
                console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);

                // Настройка вебхука в продакшн или локальный режим для разработки
                if (process.env.NODE_ENV === "production") {
                    bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`);
                    console.log("Bot is running in webhook mode");
                } else {
                    // Для локальной разработки используем polling
                    bot.launch()
                    console.log("Bot is running in polling mode");
                }
            });
        } catch (error) {
            console.log(error)
        }
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
