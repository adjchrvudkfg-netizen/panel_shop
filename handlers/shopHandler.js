const { Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const { sendPaymentGateway } = require('../services/paymentService');

function getStoredKeys() {
    try {
        const filePath = path.join(__dirname, '../data/keys.json');
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {
        console.error('Error reading keys:', e);
    }
    return {};
}

function consumeKey(productKey) {
    try {
        const filePath = path.join(__dirname, '../data/keys.json');
        const keysData = getStoredKeys();
        
        if (keysData[productKey] && keysData[productKey].length > 0) {
            const assignedKey = keysData[productKey].shift();
            fs.writeFileSync(filePath, JSON.stringify(keysData, null, 2));
            return assignedKey;
        }
    } catch (e) {
        console.error('Error consuming key:', e);
    }
    return null;
}

function setupShopHandler(bot) {
    // Shop Menu
    bot.action('shop_menu', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.editMessageText(`🛍️ **– ADITYA PANEL SHOP –** 🛍️\n\nPlease select a product below:`, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('👻 Phantom Panel', 'product_phantom')],
                    [Markup.button.callback('💧 Drip Client', 'product_drip')],
                    [Markup.button.callback('🔙 Back to Main Menu', 'back_to_start')]
                ])
            });
        } catch (e) { console.error(e); }
    });

    // Phantom Prices
    bot.action('product_phantom', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.editMessageText(`👻 **PHANTOM PANEL - PRICING** 👻`, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('1 Day - ₹95', 'buy_phantom_95')],
                    [Markup.button.callback('3 Days - ₹145', 'buy_phantom_145')],
                    [Markup.button.callback('7 Days - ₹320', 'buy_phantom_320')],
                    [Markup.button.callback('🔙 Back to Shop', 'shop_menu')]
                ])
            });
        } catch (e) { console.error(e); }
    });

    // Drip Client Prices
    bot.action('product_drip', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.editMessageText(`💧 **DRIP CLIENT - PRICING** 💧`, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('1 Day - ₹99', 'buy_drip_99')],
                    [Markup.button.callback('7 Days - ₹299', 'buy_drip_299')],
                    [Markup.button.callback('30 Days - ₹599', 'buy_drip_599')],
                    [Markup.button.callback('🔙 Back to Shop', 'shop_menu')]
                ])
            });
        } catch (e) { console.error(e); }
    });

    // Buy Product & Trigger QR Gateway
    bot.action(/^buy_(phantom|drip)_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Opening Payment Gateway...');
        const productType = ctx.match[1];
        const amount = ctx.match[2];
        const internalKey = `${productType}_${amount}`;

        await sendPaymentGateway(ctx, amount, `verify_key_${internalKey}`, 'shop_menu');
    });

    // Verify & Auto Key Delivery
    bot.action(/^verify_key_(.+)$/, async (ctx) => {
        await ctx.answerCbQuery('Verifying...');
        const internalKey = ctx.match[1];
        const assignedKey = consumeKey(internalKey);

        if (!assignedKey) {
            return ctx.reply('⚠️ Filhal is plan ki stock me key available nahi hai! Admin se contact karein.');
        }

        await ctx.reply(`🎉 **KEY DELIVERED SUCCESSFULLY!**\n\n\`${assignedKey}\``, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('🛍️ Back to Shop', 'shop_menu')]
            ])
        });
    });

    // Back to Main Menu
    bot.action('back_to_start', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const welcomeText = `⌨️ – ADITYA PANEL SHOP – ⌨️\n\n🌸 Hello, ${ctx.from.first_name || 'User'}!`;
            await ctx.editMessageText(welcomeText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🛍️ Shop', 'shop_menu')],
                    [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📦 My Orders', 'my_orders')],
                    [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.url('PAID_PUSH 💯', 'https://t.me/+rd5guGEUyR41MzA1')],
                    [Markup.button.url('🎧 Support', 'https://t.me/adityachoudhary5')]
                ])
            });
        } catch (e) { console.error(e); }
    });
}

// Optional wallet handler file content can also be merged or kept separate
function setupWalletHandler(bot) {
    bot.action('add_balance', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await sendPaymentGateway(ctx, 50, 'verify_balance_50', 'back_to_start');
        } catch (e) { console.error(e); }
    });

    bot.action(/^verify_balance_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Verifying...');
        await ctx.reply(`✅ Payment verification request received! Admin verify karke balance add kar dega.`);
    });
}

module.exports = { setupShopHandler, setupWalletHandler };