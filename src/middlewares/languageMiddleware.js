const User = require("../models/User");
const i18n = require("../localization/i18n");

async function languageMiddleware(ctx, next) {
    try {
        let user = null;

        if (ctx.from) {
            user = await User.findOne({ telegramId: ctx.from.id });
        }

        // Set language for this request
        const language = user?.language || "uz";
        ctx.i18n = i18n;
        i18n.setLocale(language);

        // Add translation helper to context
        ctx.t = (key, options = {}) => {
            return i18n.__(key, options);
        };

        await next();
    } catch (error) {
        console.error("Language middleware error:", error);
        await next();
    }
}

module.exports = languageMiddleware;
