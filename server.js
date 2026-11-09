require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const token = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!token) {
    console.error('BOT_TOKEN is required!');
    process.exit(1);
}

const bot = new Telegraf(token);
const app = express();

// Express ko JSON parse karne ke liye configure karein
app.use(express.json());

// Render ka public URL automatic le lega
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || `https://panel-shop.onrender.com`;
const webhookPath = `/telegraf/${bot.secretPathComponent()}`;

// Webhook setup
app.use(bot.webhookCallback(webhookPath));

// Telegram par webhook set karein
bot.telegram.setWebhook(`${RENDER_URL}${webhookPath}`).then(() => {
    console.log(`🔗 Webhook successfully set to: ${RENDER_URL}${webhookPath}`);
});

// --- Bot Command Handlers ---
bot.start((ctx) => {
    ctx.reply('🎉 Welcome! Your Telegram Bot is successfully running via Webhook.');
});

bot.help((ctx) => {
    ctx.reply('Send /start to initialize the bot.');
});

// Echo text handler
bot.on('text', (ctx) => {
    ctx.reply(`Aapne kaha: ${ctx.message.text}`);
});

// Basic health check route for Render
app.get('/', (req, res) => {
    res.send('🤖 Telegram Bot is running live via Webhook!');
});

// Server start karein
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));