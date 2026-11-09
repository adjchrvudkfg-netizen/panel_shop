const { Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const { sendPaymentGateway } = require('../services/paymentService');

// Helper to read keys from keys.json
function getStoredKeys() {
    try {
        const filePath = path.join(__dirname, '../data/keys.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error reading keys:', e);
    }
    return {};
}

// Helper to remove and return a used key
function consumeKey(productKey) {
    try {
        const filePath = path.join(__dirname, '../data/keys.json');
        const keysData = getStoredKeys();
        
        if (keysData[productKey] && keysData[productKey].length > 0) {
            const assignedKey = keysData[productKey].shift(); // Pehli key nikal li
            fs.writeFileSync(filePath, JSON.stringify(keysData, null, 2)); // Stock update save kiya
            return assignedKey;
        }
    } catch (e) {
        console.error('Error consuming key:', e);
    }
    return null;
}

function setupShopHandler(bot) {
    // 1. Shop Menu
    bot.action('shop_menu', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const shopText = `🛍️ **– ADITYA PANEL SHOP –** 🛍️\n\nPlease select a product below to view prices and buy:`;
            await ctx.editMessageText(shopText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('👻 Phantom Panel', 'product_phantom')],
                    [Markup.button.callback('💧 Drip Client', 'product_drip')],
                    [Markup.button.callback('🔙 Back to Main Menu', 'back_to_start')]
                ])
            });
        } catch (error) {
            console.error('Error in shop_menu:', error);
        }
    });

    // 2. Phantom Panel Prices
    bot.action('product_phantom', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const phantomText = 
`👻 **PHANTOM PANEL - PRICING** 👻

Select your desired plan below:
🔗 [Click here to view Phantom update](https://t.me/c/4332593307/2/5)`;

            await ctx.editMessageText(phantomText, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('1 Day - ₹95', 'buy_phantom_95')],
                    [Markup.button.callback('3 Days - ₹145', 'buy_phantom_145')],
                    [Markup.button.callback('7 Days - ₹320', 'buy_phantom_320')],
                    [Markup.button.callback('🔙 Back to Shop', 'shop_menu')]
                ])
            });
        } catch (error) {
            console.error('Error in product_phantom:', error);
        }
    });

    // 3. Drip Client Prices
    bot.action('product_drip', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const dripText = 
`💧 **DRIP CLIENT - PRICING** 💧

Select your desired plan below:
🔗 [Click here to view Drip Client update](https://t.me/c/4332593307/3/4)`;

            await ctx.editMessageText(dripText, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('1 Day - ₹99', 'buy_drip_99')],
                    [Markup.button.callback('7 Days - ₹299', 'buy_drip_299')],
                    [Markup.button.callback('30 Days - ₹599', 'buy_drip_599')],
                    [Markup.button.callback('🔙 Back to Shop', 'shop_menu')]
                ])
            });
        } catch (error) {
            console.error('Error in product_drip:', error);
        }
    });

    // 4. Plan click hote hi paymentService se QR generate karna
    bot.action(/^buy_(phantom|drip)_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Opening Payment Gateway...');
        const productType = ctx.match[1];
        const planDuration = ctx.match[2];
        const amount = parseInt(planDuration, 10);
        const internalKey = `${productType}_${amount}`;

        // Dedicated Payment Service call ki (No QR error)
        await sendPaymentGateway(ctx, amount, `verify_key_${internalKey}`, 'shop_menu');
    });

    // 5. Payment Verification & Automatic Key Delivery
    bot.action(/^verify_key_(.+)$/, async (ctx) => {
        const internalKey = ctx.match[1]; // jaise phantom_95 ya drip_99
        await ctx.answerCbQuery('Verifying payment and fetching key...');

        // Stock se key nikal li aur list se delete kar di
        const assignedKey = consumeKey(internalKey);

        if (!assignedKey) {
            return ctx.reply('⚠️ Filhal is plan ki stock me koi key available nahi hai! Kripya admin (@adityachoudhary5) se contact karein, jald hi stock refill kar diya jayega.');
        }

        const successText = 
`🎉 **PAYMENT SUCCESSFUL & KEY DELIVERED!** 🎉

──────────────────
🔑 **Your License Key:**
\`${assignedKey}\`
──────────────────

⚠️ Is key ko sambhal kar rakhein. Yeh key ab stock se hata di gayi hai taaki koi aur use na kar sake.`;

        try {
            await ctx.reply(successText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🛍️ Back to Shop', 'shop_menu')]
                ])
            });
        } catch (e) {
            console.error('Key delivery message error:', e);
        }
    });

    // 6. Back to Main Menu Handler
    bot.action('back_to_start', async (ctx) => {
        try {
            await ctx.answerCbQuery();
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

            await ctx.editMessageText(welcomeText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🛍️ Shop', 'shop_menu')],
                    [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📦 My Orders', 'my_orders')],
                    [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.url('PAID_PUSH 💯', 'https://t.me/+rd5guGEUyR41MzA1')],
                    [Markup.button.url('🎧 Support', 'https://t.me/adityachoudhary5')]
                ])
            });
        } catch (error) {
            console.error('Error in back_to_start:', error);
        }
    });
}

module.exports = { setupShopHandler };