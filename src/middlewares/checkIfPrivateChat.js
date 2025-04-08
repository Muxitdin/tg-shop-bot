async function checkIfPrivateChat(ctx, next) {
    try {
        if (ctx.chat && ctx.chat.type !== "private") {
            await ctx.reply("This bot only works in private chats");
            return;
        };

        await next();   
    } catch (error) {
        console.error("checkIfPrivateChat middleware error:", error);
        await next();
    }
}

module.exports = checkIfPrivateChat;
