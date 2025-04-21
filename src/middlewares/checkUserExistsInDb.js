const User = require("../models/User");

async function checkUserExistsInDb(ctx, next) {
    if (ctx.from) {
        const userId = ctx.from.id.toString();

        try {
            // Find or create user
            let user = await User.findOne({ telegramId: userId });

            // Store user in context for easy access
            ctx.user = user;
        } catch (error) {
            console.error("Error checking user middleware:", error);
        }
    }

    return next();
};

module.exports = checkUserExistsInDb;