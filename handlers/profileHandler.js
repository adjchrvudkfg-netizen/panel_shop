const { Markup } = require('telegraf');

function setupProfileHandler(bot) {
    // 1. My Profile View with Back Button
    bot.action('my_profile', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const profileText = 
`👤 **USER PROFILE**

🆔 **User ID:** \`${ctx.from.id}\`
👤 **Name:** ${ctx.from.first_name}
💰 **Wallet Balance:** ₹0
📦 **Total Orders:** 0`;

            await ctx.editMessageText(profileText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🔙 Back to Main Menu', 'back_to_start')]
                ])
            });
        } catch (error) {
            console.error('Error in my_profile action:', error);
        }
    });

    // 2. My Orders View with Back Button
    bot.action('my_orders', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const ordersText = 
`📦 **MY ORDERS**

Aapke paas abhi koi active orders nahi hain.`;

            await ctx.editMessageText(ordersText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🔙 Back to Main Menu', 'back_to_start')]
                ])
            });
        } catch (error) {
            console.error('Error in my_orders action:', error);
        }
    });
}

module.exports = { setupProfileHandler };