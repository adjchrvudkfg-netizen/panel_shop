require('dotenv').config();
const { Telegraf } = require('telegraf');

const { setupStartHandler } = require('./handlers/startHandler');
const { setupShopHandler } = require('./handlers/shopHandler');
const { setupWalletHandler } = require('./handlers/walletHandler');
const { setupProfileHandler } = require('./handlers/profileHandler');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Registering Handlers
setupStartHandler(bot);
setupShopHandler(bot);
setupWalletHandler(bot);
setupProfileHandler(bot);

// Launch Bot
bot.launch().then(() => {
  console.log('🤖 Bot is successfully running!');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));