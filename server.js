require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { getMainMenu } = require('./utils/keyboards');
const { setupProfileHandler } = require('./handlers/profileHandler');
const { setupWalletHandler } = require('./handlers/walletHandler');
const { setupShopHandler } = require('./handlers/shopHandler');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const ADMIN_ID = 8805135936; // Aapka Telegram Admin ID

const bot = new Telegraf(BOT_TOKEN);
const users = {}; // Shared Database object

// Start Command
bot.start((ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name || 'User';
  if (!users[userId]) users[userId] = { balance: 0, orders: [] };
  const user = users[userId];

  const text = `═══ - ADITYA PANEL SHOP - ═══\n\n` +
               `🌸 Hello, ${firstName}!\n\n` +
               `☆ Premium digital keys, instant delivery.\n\n` +
               `Tap any button below to begin.\n` +
               `_____________________\n` +
               `👤 User ID: ${userId}\n` +
               `💰 Wallet Balance: ₹${user.balance}`;

  return ctx.reply(text, getMainMenu());
});

// Back to Main Menu
bot.action('main_menu', (ctx) => {
  ctx.answerCbQuery();
  const userId = ctx.from.id;
  if (!users[userId]) users[userId] = { balance: 0, orders: [] };
  const user = users[userId];

  const text = `═══ - ADITYA PANEL SHOP - ═══\n\n` +
               `🌸 Hello, ${ctx.from.first_name}!\n\n` +
               `Tap any button below to begin.\n` +
               `_____________________\n` +
               `👤 User ID: ${userId}\n` +
               `💰 Wallet Balance: ₹${user.balance}`;

  return ctx.editMessageText(text, getMainMenu());
});

// Setup Handlers
setupProfileHandler(bot, users);
setupWalletHandler(bot, users, ADMIN_ID);
setupShopHandler(bot, users, ADMIN_ID); // Yahan ADMIN_ID pass karna zaroori hai

// Support
bot.action('support', (ctx) => {
  ctx.answerCbQuery();
  return ctx.editMessageText('🎧 **Support Center**\n\nKisi bhi samasya ke liye admin se sampark karein: @adityachoudhary5', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'main_menu')]])
  });
});

// Express server for Render port binding
const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running successfully!');
});

server.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// Launch Telegram Bot
bot.launch();