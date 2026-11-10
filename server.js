require('dotenv').config();
const { Telegraf } = require('telegraf');
const http = require('http');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Import all modular handlers safely
require('./handlers/startHandler')(bot);
require('./handlers/shopHandler')(bot);
require('./handlers/profileHandler')(bot);
require('./handlers/walletHandler')(bot);

// Express server setup for Render port binding
const PORT = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running successfully!');
});

server.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// Launch Telegram Bot safely with error handling
bot.launch().then(() => {
  console.log('Telegram bot started successfully!');
}).catch((err) => {
  console.error('Failed to launch bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));