const { Markup } = require('telegraf');

// Universal QR URL Generator
function generateUpiQrUrl(amount, upiId = '9694421148@fam', payeeName = 'Aditya') {
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&format=png`;
    return { upiString, qrImageUrl };
}

// Universal Payment Gateway Sender
async function sendPaymentGateway(ctx, amount, callbackActionName, backActionName = 'shop_menu') {
    const upiId = '9694421148@fam';
    const { upiString, qrImageUrl } = generateUpiQrUrl(amount, upiId, 'Aditya');

    const paymentText = 
`🏛️ **FAMCORP PAYMENT GATEWAY**

──────────────────
👤 **UPI ID:** \`${upiId}\`
💰 **Amount:** ₹${amount}
──────────────────

1. Kisi bhi UPI App (PhonePe, GPay, FamPay) se upar diye gaye QR ko scan karein ya **[Click Here to Pay via UPI App](${upiString})** par click karein.
2. Payment hone ke baad neeche **"✅ Payment Done"** button dabayein.`;

    try {
        await ctx.replyWithPhoto(qrImageUrl, {
            caption: paymentText,
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('✅ Payment Done', callbackActionName)],
                [Markup.button.callback('◀️ Back', backActionName)]
            ])
        });
    } catch (err) {
        console.error('QR Send Error:', err);
        await ctx.reply(paymentText, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('✅ Payment Done', callbackActionName)],
                [Markup.button.callback('◀️ Back', backActionName)]
            ])
        });
    }
}

module.exports = { generateUpiQrUrl, sendPaymentGateway };