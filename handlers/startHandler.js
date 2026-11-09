const { Markup } = require('telegraf');

function setupStartHandler(bot) {
    bot.start((ctx) => {
        const welcomeText = 
`🌸 **– ADITYA PANEL SHOP –** 🌸

🌸 **Hello, ${ctx.from.first_name || 'User'}!**

⚝ **Premium digital keys, instant delivery.**

– 🛒 **Wide product catalog**
– ⚡ **Instant key delivery**
– 💲 **Multiple payment gateways**
– 🛡️ **24/7 admin support**

**Tap any button below to begin.**

──────────────────
👤 User ID: \`${ctx.from.id}\`
💰 Wallet Balance: ₹0 (~$0.85)`;

        ctx.replyWithMarkdown(welcomeText, Markup.inlineKeyboard([
            [Markup.button.callback('🛍️ Shop', 'shop_menu')],
            [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📦 My Orders', 'my_orders')],
            [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.url('PAID_PUSH 💯', 'https://t.me/+rd5guGEUyR41MzA1')],
            [Markup.button.callback('🎧 Support', 'support')]
        ]));
    });
}

module.exports = { setupStartHandler };