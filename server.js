const { Telegraf } = require('telegraf');

// Initialize bot with token from environment variables
const bot = new Telegraf(process.env.BOT_TOKEN);

// Registering Handlers
// (Ensure these handler files exist and are exported properly in your project)
// setupStartHandler(bot);
// setupShopHandler(bot);
// setupWalletHandler(bot);
// setupProfileHandler(bot);

// Launch Bot with dropPendingUpdates to clear stale request queues and prevent 409 conflict
bot.launch({ dropPendingUpdates: true }).then(() => {
    console.log('🤖 Bot is successfully running!');
});

// Enable graceful stop for safe shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));