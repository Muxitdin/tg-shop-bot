const User = require('../models/User');

async function languageMiddleware(ctx, next) {
    const user = await User.findOne({ telegramId: ctx.from.id });

    if (user && user.language === 'uz') {
        ctx.reply = (text) => ctx.sendMessage(`🇺🇿 ${text}`);
    }

    return next();
}

module.exports = languageMiddleware;
