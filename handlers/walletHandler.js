const { Markup } = require('telegraf');
const { sendPaymentGateway } = require('../services/paymentService');

function setupWalletHandler(bot) {
    // Jab user keypad se amount type karke Confirm dabaye
    bot.action(/^(confirm_amount_|confirm_)?(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Processing Payment...');
        const amount = parseInt(ctx.match[2], 10) || 50;

        // Payment service ko call karke QR aur Gateway bhej diya
        await sendPaymentGateway(ctx, amount, `verify_balance_${amount}`, 'back_to_start');
    });

    // Verification for wallet balance add
    bot.action(/^verify_balance_(\d+)$/, async (ctx) => {
        const amount = ctx.match[1];
        await ctx.answerCbQuery('Verifying...');
        
        await ctx.reply(`✅ Payment verification request received for ₹${amount}. Admin verify karke jald hi balance add kar dega!`, {
            ...Markup.inlineKeyboard([
                [Markup.button.callback('🛍️ Back to Main Menu', 'back_to_start')]
            ])
        });
    });
}

module.exports = { setupWalletHandler };