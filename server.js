const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');
const https = require('https');

// Bot Token configuration
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const bot = new Telegraf(BOT_TOKEN);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// /start command (Main Welcome Menu)
bot.start(async (ctx) => {
    try {
        const welcomeText = 
`⌨️ – ADITYA PANEL SHOP – ⌨️

🌸 Hello, ${ctx.from.first_name || 'User'}!

⚝ **Premium digital keys, instant delivery.**

– 🛒 **Wide product catalog**
– ⚡ **Instant key delivery**
– 💲 **Multiple payment gateways**
– 🛡️ **24/7 admin support**

**Tap any button below to begin.**

──────────────────
👤 User ID: \`${ctx.from.id}\`
💰 Wallet Balance: ₹0 (~$0.85)`;

        await ctx.reply(welcomeText, {
            parse_mode: 'Markdown',
            ...Telegraf.Markup.inlineKeyboard([
                [Telegraf.Markup.button.callback('🛍️ Shop', 'shop_menu')],
                [Telegraf.Markup.button.callback('💳 Add Balance', 'add_balance'), Telegraf.Markup.button.callback('📦 My Orders', 'my_orders')],
                [Telegraf.Markup.button.callback('👤 My Profile', 'my_profile'), Telegraf.Markup.button.url('PAID_PUSH 💯', 'https://t.me/+rd5guGEUyR41MzA1')],
                [Telegraf.Markup.button.url('🎧 Support', 'https://t.me/adityachoudhary5')]
            ])
        });
    } catch (e) {
        console.error('Error in /start:', e);
    }
});

// Handlers ko import karke bot ke sath connect karna
try {
    const { setupShopHandler } = require('./handlers/shopHandler');
    const { setupWalletHandler } = require('./handlers/walletHandler');

    setupShopHandler(bot);
    setupWalletHandler(bot);
    console.log('✅ All handlers loaded successfully!');
} catch (e) {
    console.error('⚠️ Handler loading error:', e.message);
}

// Dummy Placeholders for unhandled buttons
['my_orders', 'my_profile'].forEach((action) => {
    bot.action(action, async (ctx) => {
        await ctx.answerCbQuery('Feature coming soon!');
    });
});

// Telegram Bot Launch
bot.launch().then(() => {
    console.log('🤖 Telegram Bot is running successfully...');
}).catch((err) => {
    console.error('Bot launch error:', err);
});

// Express Server Launch
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Web Store Server running on port ${PORT}`);
});

// Graceful Stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Self-Ping Keep-Alive (Render sleep rokne ke liye)
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://drake-panel-8py1.onrender.com';[span_0](start_span)[span_0](end_span)
setInterval(() => {
    https.get(RENDER_URL, (res) => {
        console.log(`[Keep-Alive] Pinged server, status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error('[Keep-Alive] Ping error:', err.message);
    });
}, 10 * 60 * 1000); // Har 10 minute me ping karega