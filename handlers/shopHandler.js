const { Markup } = require('telegraf');

// Helper function to generate FamPay UPI QR URL
function generateUpiQrUrl(amount, upiId = '9694421148@fam', payeeName = 'Aditya') {
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&margin=2`;
    return { upiString, qrImageUrl };
}

function setupShopHandler(bot) {
    // 1. Shop Menu - Products list
    bot.action('shop_menu', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const shopText = 
`🛍️ **– ADITYA PANEL SHOP –** 🛍️

Please select a product below to view prices and buy:`;

            await ctx.editMessageText(shopText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('👻 Phantom Panel', 'product_phantom')],
                    [Markup.button.callback('💧 Drip Client', 'product_drip')],
                    [Markup.button.callback('🔙 Back to Main Menu', 'back_to_start')]
                ])
            });
        } catch (error) {
            console.error('Error in shop_menu action:', error);
        }
    });

    // 2. Phantom Prices (Link attached)
    bot.action('product_phantom', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const phantomText = 
`👻 **PHANTOM PANEL - PRICING** 👻

Select your desired plan below:`;

            await ctx.editMessageText(phantomText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('1 Day - ₹95', 'buy_phantom_95')],
                    [Markup.button.callback('3 Days - ₹145', 'buy_phantom_145')],
                    [Markup.button.callback('7 Days - ₹320', 'buy_phantom_320')],
                    [Markup.button.url('🔗 View Phantom Channel', 'https://t.me/c/4332593307/2/5')],
                    [Markup.button.callback('🔙 Back to Shop', 'shop_menu')]
                ])
            });
        } catch (error) {
            console.error('Error in product_phantom:', error);
        }
    });

    // 3. Drip Client Prices (Link attached)
    bot.action('product_drip', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const dripText = 
`💧 **DRIP CLIENT - PRICING** 💧

Select your desired plan below:`;

            await ctx.editMessageText(dripText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('1 Day - ₹99', 'buy_drip_99')],
                    [Markup.button.callback('7 Days - ₹299', 'buy_drip_299')],
                    [Markup.button.callback('30 Days - ₹599', 'buy_drip_599')],
                    [Markup.button.url('🔗 View Drip Client Channel', 'https://t.me/c/4332593307/3/4')],
                    [Markup.button.callback('🔙 Back to Shop', 'shop_menu')]
                ])
            });
        } catch (error) {
            console.error('Error in product_drip:', error);
        }
    });

    // 4. Plan click hote hi exact utne amount ka FamPay QR generate karna
    bot.action(/^buy_\w+_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Generating Payment QR...');
        const amount = parseInt(ctx.match[1], 10);

        try {
            const { qrImageUrl, upiString } = generateUpiQrUrl(amount, '9694421148@fam', 'Aditya');

            const paymentText = 
`🏛️ **FAMCORP PAYMENT GATEWAY**

──────────────────
👤 **UPI ID:** \`9694421148@fam\`
💰 **Amount:** ₹${amount}
──────────────────

1. Is QR code ko apne **FamPay** ya kisi bhi UPI app se scan karke payment karein.
2. Payment hone ke baad niche **"✅ Payment Done"** par click karein.`;

            await ctx.replyWithPhoto(qrImageUrl, {
                caption: paymentText,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('⚡ Pay via UPI App', upiString)],
                    [Markup.button.callback(`✅ Payment Done (₹${amount})`, `verify_pay_${amount}`)],
                    [Markup.button.callback('◀️ Back to Shop', 'shop_menu')]
                ])
            });
        } catch (err) {
            console.error('QR Gen Error:', err);
            await ctx.reply('⚠️ QR generate karne me kuch dikkat aayi. Kripya dubara try karein.');
        }
    });

    // 5. Back to Main Menu Handler
    bot.action('back_to_start', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const welcomeText = 
`🌸 **– ADITYA PANEL SHOP –** 🌸

🌸 **Hello, ${ctx.from.first_name || 'User'}!**

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
            console.error('Error in back_to_start action:', error);
        }
    });
}

module.exports = { setupShopHandler };