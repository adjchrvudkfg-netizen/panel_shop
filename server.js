require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

// Apne handlers folder se saare handlers import karein
const { setupStartHandler } = require('./handlers/startHandler');
const { setupShopHandler } = require('./handlers/shopHandler');
const { setupProfileHandler } = require('./handlers/profileHandler');
const { setupWalletHandler } = require('./handlers/walletHandler');

const token = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!token) {
    console.error('BOT_TOKEN is required!');
    process.exit(1);
}

const bot = new Telegraf(token);
const app = express();

// Express JSON middleware
app.use(express.json());

// Render URL aur Webhook configuration
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || `https://panel-shop.onrender.com`;
const webhookPath = `/telegraf/${bot.secretPathComponent()}`;

app.use(bot.webhookCallback(webhookPath));

bot.telegram.setWebhook(`${RENDER_URL}${webhookPath}`).then(() => {
    console.log(`🔗 Webhook successfully set to: ${RENDER_URL}${webhookPath}`);
});

// --- Register All Handlers ---
if (typeof setupStartHandler === 'function') setupStartHandler(bot);
if (typeof setupShopHandler === 'function') setupShopHandler(bot);
if (typeof setupProfileHandler === 'function') setupProfileHandler(bot);
if (typeof setupWalletHandler === 'function') setupWalletHandler(bot);

// Basic Health Check Route for Render
app.get('/', (req, res) => {
    res.send('🤖 Telegram Panel Shop Bot is running live via Webhook!');
});

// Server Start
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});

// Graceful Stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));