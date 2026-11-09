const { Markup } = require('telegraf');

function setupProfileHandler(bot) {
    bot.action('my_profile', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const profileText = 
`👤 **USER PROFILE**

🆔 **User ID:** \`${ctx.from.id}\`
👤 **Name:** ${ctx.from.first_name}
💰 **Wallet Balance:** ₹0
📦 **Total Orders:** 0`;

            await ctx.reply(profileText, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error('Error in my_profile action:', error);
        }
    });

    bot.action('support', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.reply('🎧 For any support or issues, contact admin: @YourAdminUsername');
        } catch (error) {
            console.error('Error in support action:', error);
        }
    });

    // Baaki actions ke liye fallback handler
    const actionsList = ['how_to_use', 'referral', 'daily_spin', 'selling_proof', 'leaderboard'];
    actionsList.forEach((act) => {
        bot.action(act, async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.reply(`✨ Feature '${act.replace(/_/g, ' ')}' is coming soon!`);
        });
    });
}

module.exports = { setupProfileHandler };