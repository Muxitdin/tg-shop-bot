async function deletePreviousMessage(ctx) {
    if (ctx.session.lastMessageId) {
        try {
            await ctx.deleteMessage(ctx.session.lastMessageId);
        } catch (err) {
            console.error("Ошибка при удалении предыдущего сообщения:", err.message);
        }
    }
}

module.exports = deletePreviousMessage;
