const { Markup } = require('telegraf');

function setupShopHandler(bot) {
    // 1. Shop Menu - Products list (Phantom & Drip Client)
    bot.action('shop_menu', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const shopText = 
`🛍️ **– ADITYA PANEL SHOP –** 🛍️

Please select a product below to view prices and buy:`;

            await ctx.editMessageText(shopText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('👻 Phantom Panel', 'product_phantom')],
                    [Markup.button.callback('💧 Drip Client', 'product_drip')],
                    [Markup.button.callback('🔙 Back to Main Menu', 'back_to_start')]
                ])
            });
        } catch (error) {
            console.error('Error in shop_menu action:', error);
        }
    });

    // 2. Phantom Product Prices View
    bot.action('product_phantom', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const phantomText = 
`👻 **PHANTOM PANEL - PRICING** 👻

Select your desired plan below:`;

            await ctx.editMessageText(phantomText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('1 Day - ₹95', 'buy_phantom_1d')],
                    [Markup.button.callback('3 Days - ₹145', 'buy_phantom_3d')],
                    [Markup.button.callback('7 Days - ₹320', 'buy_phantom_7d')],
                    [Markup.button.callback('🔙 Back to Shop', 'shop_menu')]
                ])
            });
        } catch (error) {
            console.error('Error in product_phantom:', error);
        }
    });

    // 3. Drip Client Product Prices View
    bot.action('product_drip', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const dripText = 
`💧 **DRIP CLIENT - PRICING** 💧

Select your desired plan below:`;

            await ctx.editMessageText(dripText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('1 Day - ₹35', 'buy_drip_1d')],
                    [Markup.button.callback('3 Days - ₹65', 'buy_drip_3d')],
                    [Markup.button.callback('7 Days - ₹170', 'buy_drip_7d')],
                    [Markup.button.callback('🔙 Back to Shop', 'shop_menu')]
                ])
            });
        } catch (error) {
            console.error('Error in product_drip:', error);
        }
    });

    // 4. Purchase Click Handlers (Jab koi plan select kare)
    bot.action(/^buy_(phantom|drip)_(\w+)$/, async (ctx) => {
        await ctx.answerCbQuery('Processing order...');
        const product = ctx.match[1];
        const duration = ctx.match[2];
        
        await ctx.reply(`🛒 Aapne **${product.toUpperCase()} (${duration.toUpperCase()})** select kiya hai!\n\n⚠️ Key purchase karne ke liye kripya pehle **'Add Balance'** se wallet me balance add karein.`);
    });

    // 5. Back to Start / Main Menu Handler
    bot.action('back_to_start', async (ctx) => {
        try {
            await ctx.answerCbQuery();
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

            await ctx.editMessageText(welcomeText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('🛍️ Shop', 'shop_menu')],
                    [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📦 My Orders', 'my_orders')],
                    [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.url('PAID_PUSH 💯', 'https://t.me/+rd5guGEUyR41MzA1')],
                    [Markup.button.url('🎧 Support', 'https://t.me/adityachoudhary5')]
                ])
            });
        } catch (error) {
            console.error('Error in back_to_start action:', error);
        }
    });
}

module.exports = { setupShopHandler };