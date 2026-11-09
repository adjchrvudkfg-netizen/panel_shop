const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

// Bot Token configuration
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const bot = new Telegraf(BOT_TOKEN);

const app = express();
app.use(express.json());

// Public folder ko static serve karna taaki website khul sake
app.use(express.static(path.join(__dirname, 'public')));

// 1. Dynamic QR Generator API Endpoint for Website
app.get('/api/generate-qr', (req, res) => {
    const amount = req.query.amount || 95;
    const upiId = '9694421148@fam';
    const payeeName = 'Aditya';
    
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&margin=2&format=png`;

    res.json({
        upiString,
        qrImageUrl,
        upiId,
        amount
    });
});

// Handlers ko import karna
try {
    const { setupStartHandler } = require('./handlers/startHandler');
    const { setupShopHandler } = require('./handlers/shopHandler');
    const { setupWalletHandler } = require('./handlers/walletHandler');

    setupStartHandler(bot);
    setupShopHandler(bot);
    setupWalletHandler(bot);
} catch (e) {
    console.log('Handlers note:', e.message);
}

// Telegram Bot Launch
bot.launch().then(() => {
    console.log('🤖 Telegram Bot is running...');
}).catch((err) => {
    console.error('Bot launch error:', err);
});

// Express Server Launch (Render port par chalega)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Web Store Server running on port ${PORT}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// ==========================================
// YAHAN FILE KE BILKUL LAST ME ISKO PASTE KAR DO:
// ==========================================
const https = require('https');
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://drake-panel-8py1.onrender.com';[span_0](start_span)[span_0](end_span)

setInterval(() => {
    https.get(RENDER_URL, (res) => {
        console.log(`[Keep-Alive] Self-ping status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error('[Keep-Alive] Ping error:', err.message);
    });
}, 10 * 60 * 1000); // Har 10 minute me server ko khud ping karega