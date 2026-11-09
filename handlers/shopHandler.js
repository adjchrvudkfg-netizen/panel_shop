const { Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

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

    // Phantom Prices
    bot.action('product_phantom', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const phantomText = `👻 **PHANTOM PANEL - PRICING** 👻\n\nSelect your desired plan below:\n🔗 [Click here to view Phantom update](https://t.me/c/4332593307/2/5)`;
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

    // Drip Client Prices (Fixed)
    bot.action('product_drip', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const dripText = `💧 **DRIP CLIENT - PRICING** 💧\n\nSelect your desired plan below:\n🔗 [Click here to view Drip Client update](https://t.me/c/4332593307/3/4)`;
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

    // Buy Plan & Generate Payment Gateway Message
    bot.action(/^buy_(phantom|drip)_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Opening Payment Gateway...');
        const productType = ctx.match[1];
        const planDuration = ctx.match[2];
        const amount = parseInt(planDuration, 10);
        const internalKey = `${productType}_${amount}`;
        const upiId = '9694421148@fam';

        const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent('Aditya')}&am=${amount}&cu=INR`;
        const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&margin=2&format=png`;

        const paymentText = 
`🏛️ **FAMCORP PAYMENT GATEWAY**

──────────────────
👤 **UPI ID:** \`${upiId}\`
💰 **Amount:** ₹${amount}
──────────────────

1. Niche diye gaye button par click karke payment karein ya QR scan karein.
2. Payment hone ke baad **"✅ Payment Done"** par click karein.`;

        try {
            await ctx.deleteMessage().catch(() => {});
            await ctx.replyWithPhoto(qrImageUrl, {
                caption: paymentText,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('⚡ Pay via FamPay / UPI App', upiString)],
                    [Markup.button.callback(`✅ Payment Done`, `verify_key_${internalKey}`)],
                    [Markup.button.callback('◀️ Back to Shop', 'shop_menu')]
                ])
            });
        } catch (err) {
            // Fallback agar photo send na ho paye toh text message bhej dega taaki ruka na rahe
            await ctx.reply(paymentText + `\n\n🔗 **Direct Payment Link:** ${upiString}`, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('⚡ Pay via UPI App', upiString)],
                    [Markup.button.callback(`✅ Payment Done`, `verify_key_${internalKey}`)],
                    [Markup.button.callback('◀️ Back to Shop', 'shop_menu')]
                ])
            });
        }
    });

    // Verify & Auto Key Delivery
    bot.action(/^verify_key_(.+)$/, async (ctx) => {
        const internalKey = ctx.match[1];
        await ctx.answerCbQuery('Verifying payment & fetching key...');

        const assignedKey = consumeKey(internalKey);

        if (!assignedKey) {
            return ctx.reply('⚠️ Filhal is plan ki stock me koi key available nahi hai! Kripya admin (@adityachoudhary5) se contact karein.');
        }

        const successText = 
`🎉 **PAYMENT SUCCESSFUL & KEY DELIVERED!** 🎉

──────────────────
🔑 **Your License Key:**
\`${assignedKey}\`
──────────────────

⚠️ Yeh key ab stock se hata di gayi hai.`;

        try {
            await ctx.editMessageCaption(successText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🛍️ Back to Shop', 'shop_menu')]
                ])
            });
        } catch (e) {
            await ctx.reply(successText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🛍️ Back to Shop', 'shop_menu')]
                ])
            });
        }
    });

    // Back to Main Menu
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