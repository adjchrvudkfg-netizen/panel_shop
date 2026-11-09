const { Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const { sendPaymentGateway } = require('../services/paymentService');

// Aapka Telegram Admin ID set kar diya gaya hai
const ADMIN_ID = '8805135936';

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
    // 1. Shop Menu
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

    // 2. Phantom Prices
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

    // 3. Drip Client Prices
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

    // 4. Buy Product & Trigger QR Gateway with Admin Tracking
    bot.action(/^buy_(phantom|drip)_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Opening Payment Gateway...');
        const productType = ctx.match[1];
        const amount = ctx.match[2];
        const internalKey = `${productType}_${amount}`;

        // User ID ke sath payment done action banaya
        await sendPaymentGateway(ctx, amount, `paydone_${ctx.from.id}_${internalKey}`, 'shop_menu');
    });

    // 5. User clicks "Payment Done" -> Notify Admin
    bot.action(/^paydone_(\d+)_(.+)$/, async (ctx) => {
        await ctx.answerCbQuery('Payment submission sent to Admin!');
        const userId = ctx.match[1];
        const internalKey = ctx.match[2];

        await ctx.editMessageText(`⏳ **Payment Verification Pending**\n\nAapki payment request admin ke paas bhej di gayi hai. Admin verify karte hi aapko key mil jayegi!`, {
            parse_mode: 'Markdown'
        });

        const adminText = 
`🔔 **NEW PAYMENT VERIFICATION REQUEST**

👤 **User ID:** \`${userId}\`
📦 **Product/Plan:** \`${internalKey}\`

Kripya check karein ki payment prapt hui hai ya nahi:`;

        try {
            await bot.telegram.sendMessage(ADMIN_ID, adminText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('✅ Approve & Send Key', `admin_approve_${userId}_${internalKey}`)],
                    [Markup.button.callback('❌ Reject', `admin_reject_${userId}`)]
                ])
            });
        } catch (err) {
            console.error('Failed to send admin notification:', err);
        }
    });

    // 6. Admin clicks "Approve" -> Deliver Key Automatically to User
    bot.action(/^admin_approve_(\d+)_(.+)$/, async (ctx) => {
        await ctx.answerCbQuery('Approving payment...');
        const userId = ctx.match[1];
        const internalKey = ctx.match[2];

        const assignedKey = consumeKey(internalKey);

        if (!assignedKey) {
            return ctx.editMessageText(`⚠️ Error: Stock me ab '${internalKey}' ki koi key bachi nahi hai!`);
        }

        await ctx.editMessageText(`✅ **Payment Approved Successfully!**\nKey user ko deliver kar di gayi hai.`);

        try {
            await bot.telegram.sendMessage(userId, 
`🎉 **PAYMENT APPROVED & KEY DELIVERED!** 🎉

──────────────────
🔑 **Your License Key:**
\`${assignedKey}\`
──────────────────

Thank you for purchasing!`, {
                parse_mode: 'Markdown'
            });
        } catch (err) {
            console.error('Failed to deliver key to user:', err);
            await ctx.reply(`⚠️ User ko message nahi ja saka. Key ye rahi: \`${assignedKey}\``);
        }
    });

    // 7. Admin clicks "Reject"
    bot.action(/^admin_reject_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Payment rejected.');
        const userId = ctx.match[1];

        await ctx.editMessageText(`❌ **Payment Rejected.**`);

        try {
            await bot.telegram.sendMessage(userId, `❌ Aapki payment request admin dwara **reject** kar di gayi hai. Support (@adityachoudhary5) se sampark karein.`);
        } catch (e) {
            console.error(e);
        }
    });

    // 8. Add Balance Handler
    bot.action('add_balance', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await sendPaymentGateway(ctx, 50, `paydone_${ctx.from.id}_wallet_50`, 'back_to_start');
        } catch (e) { console.error(e); }
    });

    // 9. Back to Main Menu
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
        } catch (e) { console.error(e); }
    });
}

module.exports = { setupShopHandler };