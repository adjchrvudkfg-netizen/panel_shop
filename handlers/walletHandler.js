const { Markup } = require('telegraf');
const { generateUpiQrUrl } = require('../services/paymentService');

function setupWalletHandler(bot) {
    // 1. Add Balance click hone par direct Amount Select karne ka menu dikhana
    bot.action('add_balance', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const text = 
`🏛️ **ADD BALANCE - FAMCORP**

──────────────────
Method: 💚 FamPay UPI (\`9694421148@fam\`)
──────────────────

Apna amount select karein jise aap add karna chahte hain:`;

            await ctx.editMessageText(text, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('💵 ₹50', 'pay_amt_50'), Markup.button.callback('💵 ₹100', 'pay_amt_100')],
                    [Markup.button.callback('💵 ₹200', 'pay_amt_200'), Markup.button.callback('💵 ₹500', 'pay_amt_500')],
                    [Markup.button.callback('💵 ₹1000', 'pay_amt_1000'), Markup.button.callback('💵 ₹2000', 'pay_amt_2000')],
                    [Markup.button.callback('◀️ Back to Menu', 'back_to_start')]
                ])
            });
        } catch (error) {
            console.error('Error in add_balance:', error);
        }
    });

    // 2. Jaise hi user koi amount select kare, turant FamPay QR generate ho jaye
    bot.action(/^pay_amt_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Generating QR...');
        const amount = parseInt(ctx.match[1], 10);

        // FamPay UPI QR generate karein
        const { qrImageUrl, upiString } = generateUpiQrUrl(amount, '9694421148@fam', 'Aditya');

        const paymentText = 
`🏛️ **FAMCORP PAYMENT GATEWAY**

──────────────────
👤 **UPI ID:** \`9694421148@fam\`
💰 **Amount:** ₹${amount}
──────────────────

1. Is QR code ko apne **FamPay** ya kisi bhi UPI app se scan karein.
2. Payment complete hone ke baad niche **"✅ Payment Done"** button par click karein.`;

        try {
            await ctx.replyWithPhoto(qrImageUrl, {
                caption: paymentText,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('⚡ Pay via UPI App', upiString)],
                    [Markup.button.callback(`✅ Payment Done (₹${amount})`, `verify_pay_${amount}`)],
                    [Markup.button.callback('◀️ Choose Another Amount', 'add_balance')]
                ])
            });
        } catch (err) {
            console.error('Error sending QR photo:', err);
            await ctx.reply('⚠️ QR code generate karne me kuch dikkat aayi. Kripya dubara try karein.');
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