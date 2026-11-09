const { Markup } = require('telegraf');
const { generateUpiQrUrl } = require('../services/paymentService');

// Track karne ke liye ki kis user ko amount enter karna hai
const waitingForAmount = {};

function setupWalletHandler(bot) {
    // 1. Add Balance click hone par custom amount mangna
    bot.action('add_balance', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            waitingForAmount[ctx.from.id] = true;

            const text = 
`🏛️ **ADD BALANCE - FAMCORP**

──────────────────
Method: 💚 FamPay UPI (\`9694421148@fam\`)
──────────────────

💬 **Kripya chat me apna amount type karke bhejein** (Jaise: \`100\`, \`500\`, \`1500\`, etc.):`;

            await ctx.editMessageText(text, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('◀️ Back to Menu', 'back_to_start')]
                ])
            });
        } catch (error) {
            console.error('Error in add_balance:', error);
        }
    });

    // 2. Dealer style: User jo bhi text/number type karega usko amount maan kar QR banana
    bot.on('text', async (ctx) => {
        const userId = ctx.from.id;
        
        // Agar user balance add karne ki state me hai
        if (waitingForAmount[userId]) {
            const textAmount = ctx.message.text.trim();
            const amount = parseInt(textAmount, 10);

            if (isNaN(amount) || amount <= 0) {
                return ctx.reply('⚠️ Kripya ek valid number enter karein (Jaise: 100, 500).');
            }

            if (amount > 50000) {
                return ctx.reply('⚠️ Maximum limit ₹50,000 tak ki hai.');
            }

            // State clear kar do
            delete waitingForAmount[userId];

            // FamPay UPI QR generate karein
            try {
                const { qrImageUrl, upiString } = generateUpiQrUrl(amount, '9694421148@fam', 'Aditya');

                const paymentText = 
`🏛️ **FAMCORP PAYMENT GATEWAY**

──────────────────
👤 **UPI ID:** \`9694421148@fam\`
💰 **Amount:** ₹${amount}
──────────────────

1. Is QR code ko apne **FamPay** ya kisi bhi UPI app se scan karein.
2. Payment complete hone ke baad niche **"✅ Payment Done"** button par click karein.`;

                await ctx.replyWithPhoto(qrImageUrl, {
                    caption: paymentText,
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('⚡ Pay via UPI App', upiString)],
                        [Markup.button.callback(`✅ Payment Done (₹${amount})`, `verify_pay_${amount}`)],
                        [Markup.button.callback('◀️ Cancel / Back', 'add_balance')]
                    ])
                });
            } catch (err) {
                console.error('QR Generation Error:', err);
                await ctx.reply('⚠️ QR generate karne me kuch dikkat aayi. Kripya dobara try karein.');
            }
        }
    });

    // 3. Payment Verification Trigger
    bot.action(/^verify_pay_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Checking payment status...');
        const amount = ctx.match[1];
        
        await ctx.reply(`🔍 Payment verification initiated for ₹${amount}.\n\n⚠️ Agar aapne payment kar diya hai, toh kripya admin (@adityachoudhary5) ko screenshot bhejiye, turant balance add kar diya jayega!`);
    });

    bot.action('my_orders', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.reply('📦 You have no active orders right now.');
        } catch (error) {
            console.error('Error in my_orders:', error);
        }
    });
}

module.exports = { setupWalletHandler };