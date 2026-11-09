const { Markup } = require('telegraf');

// Helper function to generate FamPay UPI QR URL
function generateUpiQrUrl(amount, upiId = '9694421148@fam', payeeName = 'Aditya') {
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&margin=2&format=png`;
    return { upiString, qrImageUrl };
}

function setupWalletHandler(bot) {
    // 1. Jab user keypad se amount type karke Confirm dabaye
    // (Ye regex dono tarike ke action names ko catch kar lega: confirm_amount ya koi bhi custom confirm)
    bot.action(/^(confirm_amount_|confirm_).(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Generating Payment QR...');
        
        // Match se amount nikalna
        const match = ctx.match[2] || ctx.match[1];
        const amount = parseInt(match, 10) || 50;

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

            // Purana message delete karne ki koshish taaki conflict na ho
            await ctx.deleteMessage().catch(() => {});

            await ctx.replyWithPhoto(qrImageUrl, {
                caption: paymentText,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('⚡ Pay via UPI App', upiString)],
                    [Markup.button.callback(`✅ Payment Done (₹${amount})`, `verify_balance_${amount}`)],
                    [Markup.button.callback('◀️ Back to Menu', 'back_to_start')]
                ])
            });
        } catch (err) {
            console.error('Wallet QR Gen Error:', err);
            await ctx.reply('⚠️ QR generate karne me kuch dikkat aayi. Kripya dubara try karein.');
        }
    });

    // 2. Verification for wallet balance add
    bot.action(/^verify_balance_(\d+)$/, async (ctx) => {
        const amount = ctx.match[1];
        await ctx.answerCbQuery('Verifying payment...');
        
        await ctx.reply(`✅ Payment verification request received for ₹${amount}. Admin verify karke jald hi balance add kar dega!`, {
            ...Markup.inlineKeyboard([
                [Markup.button.callback('🛍️ Back to Main Menu', 'back_to_start')]
            ])
        });
    });
}

module.exports = { setupWalletHandler };