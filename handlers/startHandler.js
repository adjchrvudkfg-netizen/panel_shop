const { Markup } = require('telegraf');

function setupStartHandler(bot) {
    bot.start(async (ctx) => {
        try {
            const firstName = ctx.from.first_name || 'User';
            const userId = ctx.from.id;

            const welcomeText = 
`/start – ADITYA PANEL SHOP – /start

/start Hello, ${firstName}!

⚝ **Premium digital keys, instant delivery.**

– 🛒 **Wide product catalog**
– ⚡ **Instant key delivery**
– 💲 **Multiple payment gateways**
– 🛡️ **24/7 admin support**

**Tap any button below to begin.**

──────────────────
👤 User ID: \`${userId}\`
💰 Wallet Balance: ₹0 (~$0.85)`;

            await ctx.reply(welcomeText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🛍️ Shop', 'shop_menu')],
                    [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📦 My Orders', 'my_orders')],
                    [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.url('PAID_PUSH 💯', 'https://t.me/+rd5guGEUyR41MzA1')],
                    [Markup.button.url('🎧 Support', 'https://t.me/adityachoudhary5')]
                ])
            });
        } catch (error) {
            console.error('Error in start handler:', error);
        }
    });
}

module.exports = { setupStartHandler };