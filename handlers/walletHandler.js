const { Markup } = require('telegraf');

function setupWalletHandler(bot) {
    bot.action('add_balance', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.reply('💳 To add balance, please contact the admin or choose a payment method below:\n\nUPI / Crypto accepted.');
        } catch (error) {
            console.error('Error in add_balance action:', error);
        }
    });

    bot.action('my_orders', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.reply('📦 You have no active orders right now.');
        } catch (error) {
            console.error('Error in my_orders action:', error);
        }
    });
}

module.exports = { setupWalletHandler };