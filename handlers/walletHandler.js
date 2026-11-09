const { Markup } = require('telegraf');

function setupWalletHandler(bot) {
    bot.action(/^(confirm_amount_|confirm_)?(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Processing Payment...');
        const amount = parseInt(ctx.match[2], 10) || 50;
        const upiId = '9694421148@fam';

        const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent('Aditya')}&am=${amount}&cu=INR`;
        const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&margin=2&format=png`;

        const paymentText = 
`🏛️ **FAMCORP PAYMENT GATEWAY**

──────────────────
👤 **UPI ID:** \`${upiId}\`
💰 **Amount:** ₹${amount}
──────────────────

1. Niche diye gaye button par click karke payment karein.
2. Payment ke baad **"✅ Payment Done"** dabayein.`;

        try {
            await ctx.deleteMessage().catch(() => {});
            await ctx.replyWithPhoto(qrImageUrl, {
                caption: paymentText,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('⚡ Pay via FamPay / UPI App', upiString)],
                    [Markup.button.callback(`✅ Payment Done (₹${amount})`, `verify_balance_${amount}`)],
                    [Markup.button.callback('◀️ Back to Menu', 'back_to_start')]
                ])
            });
        } catch (err) {
            await ctx.reply(paymentText + `\n\n🔗 **Link:** ${upiString}`, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('⚡ Pay via UPI App', upiString)],
                    [Markup.button.callback(`✅ Payment Done (₹${amount})`, `verify_balance_${amount}`)],
                    [Markup.button.callback('◀️ Back to Menu', 'back_to_start')]
                ])
            });
        }
    });

    bot.action(/^verify_balance_(\d+)$/, async (ctx) => {
        const amount = ctx.match[1];
        await ctx.answerCbQuery('Verifying...');
        await ctx.reply(`✅ Payment verification request received for ₹${amount}. Admin verify karke balance add kar dega!`, {
            ...Markup.inlineKeyboard([
                [Markup.button.callback('🛍️ Back to Main Menu', 'back_to_start')]
            ])
        });
    });
}

module.exports = { setupWalletHandler };