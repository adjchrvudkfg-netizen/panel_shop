const { Markup } = require('telegraf');

function setupShopHandler(bot) {
    bot.action('shop_menu', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const shopText = 
`🛍️ **– VETLAM PANEL SHOP –** 🛍️

Please select a category or product below:`;

            await ctx.editMessageText(shopText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🔑 Free Fire Panel Keys', 'cat_ff_keys')],
                    [Markup.button.callback('🛡️ VIP Mods & Injectors', 'cat_vip_mods')],
                    [Markup.button.callback('🔙 Back to Main Menu', 'back_to_start')]
                ])
            });
        } catch (error) {
            console.error('Error in shop_menu action:', error);
        }
    });

    bot.action('back_to_start', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const welcomeText = 
`🌸 **– VETLAM PANEL SHOP –** 🌸

🌸 **Hello, ${ctx.from.first_name || 'User'}!**

⚝ **Premium digital keys, instant delivery.**

──────────────────
👤 User ID: \`${ctx.from.id}\`
💰 Wallet Balance: ₹0 (~$0.00)`;

            await ctx.editMessageText(welcomeText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🛍️ Shop', 'shop_menu')],
                    [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📦 My Orders', 'my_orders')],
                    [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.callback('▶️ How To Use', 'how_to_use')],
                    [Markup.button.callback('🔗 Referral', 'referral'), Markup.button.callback('🎡 Daily Spin', 'daily_spin')],
                    [Markup.button.callback('🎧 Support', 'support')],
                    [Markup.button.callback('💎 Selling Proof', 'selling_proof'), Markup.button.callback('📊 Leaderboard', 'leaderboard')]
                ])
            });
        } catch (error) {
            console.error('Error in back_to_start action:', error);
        }
    });
}

module.exports = { setupShopHandler };