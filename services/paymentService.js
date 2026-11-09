const { Markup } = require('telegraf');

// 1. Universal QR URL Generator function
function generateUpiQrUrl(amount, upiId = '9694421148@fam', payeeName = 'Aditya') {
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&format=png`;
    return { upiString, qrImageUrl };
}

// 2. Universal Payment Gateway Sender (Shop aur Wallet dono ke liye)
async function sendPaymentGateway(ctx, amount, callbackActionName, backActionName = 'shop_menu') {
    const upiId = '9694421148@fam';
    const { upiString, qrImageUrl } = generateUpiQrUrl(amount, upiId, 'Aditya');

    const paymentText = 
`🏛️ **FAMCORP PAYMENT GATEWAY**

──────────────────
👤 **UPI ID:** \`${upiId}\`
💰 **Amount:** ₹${amount}
──────────────────

1. Niche diye gaye button se payment karein.
2. Payment ke baad **"✅ Payment Done"** dabayein.`;

    try {
        await ctx.replyWithPhoto(qrImageUrl, {
            caption: paymentText,
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.url('⚡ Pay via FamPay / UPI', upiString)],
                [Markup.button.callback('✅ Payment Done', callbackActionName)],
                [Markup.button.callback('◀️ Back', backActionName)]
            ])
        });
    } catch (err) {
        console.error('QR Send Error:', err);
        await ctx.reply(paymentText + `\n\n🔗 [Click to Pay via UPI App](${upiString})`, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.url('⚡ Pay via UPI', upiString)],
                [Markup.button.callback('✅ Payment Done', callbackActionName)],
                [Markup.button.callback('◀️ Back', backActionName)]
            ])
        });
    }
}

module.exports = { generateUpiQrUrl, sendPaymentGateway };