require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { getMainMenu } = require('./utils/keyboards');
const { setupProfileHandler } = require('./handlers/profileHandler');
const { setupWalletHandler } = require('./handlers/walletHandler');
const { setupShopHandler } = require('./handlers/shopHandler');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const ADMIN_ID = 8805135936;

const bot = new Telegraf(BOT_TOKEN);
const users = {}; // Shared user database object

// Start command
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

// Back to main menu helper action
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

// Setup modular handlers
setupProfileHandler(bot, users);
setupWalletHandler(bot, users, ADMIN_ID);
setupShopHandler(bot, users);

// Support action
bot.action('support', (ctx) => {
  ctx.answerCbQuery();
  return ctx.editMessageText('🎧 **Support Center**\n\nKisi bhi samasya ke liye admin se sampark karein: @adityachoudhary5', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'main_menu')]])
  });
});

bot.launch();
console.log("Modular Bot running successfully...");