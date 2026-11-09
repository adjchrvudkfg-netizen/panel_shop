const { Markup } = require('telegraf');

function setupWalletHandler(bot) {
    // Jab user 'Add Balance' par click kare
    bot.action('add_balance', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const amountText = 
`🏛️ **Custom Amount**

──────────────────
Method: 💚 UPI (ZapUPI)
Min: ₹1 | Max: ₹5,000
──────────────────

Apna amount enter karo aur payment complete karke balance add karwao.

🔻 Amount: ₹0 (~$0.00)
🔻 Amount type karo – buttons se:`;

            await ctx.editMessageText(amountText, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('💰 1', 'amt_1'), Markup.button.callback('💰 2', 'amt_2'), Markup.button.callback('💰 3', 'amt_3')],
                    [Markup.button.callback('💰 4', 'amt_4'), Markup.button.callback('💰 5', 'amt_5'), Markup.button.callback('💰 6', 'amt_6')],
                    [Markup.button.callback('💰 7', 'amt_7'), Markup.button.callback('💰 8', 'amt_8'), Markup.button.callback('💰 9', 'amt_9')],
                    [Markup.button.callback('❌ Delete', 'amt_del'), Markup.button.callback('💰 0', 'amt_0'), Markup.button.callback('✅ Confirm', 'amt_conf')],
                    [Markup.button.callback('◀️ Back', 'back_to_start')]
                ])
            });
        } catch (error) {
            console.error('Error in add_balance action:', error);
        }
    });

    // Keypad number handlers (aap chahe toh inme logic aur badha sakte hain)
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach((num) => {
        bot.action(`amt_${num}`, async (ctx) => {
            await ctx.answerCbQuery(`Aapne ${num} dabaya`);
        });
    });

    bot.action('amt_del', async (ctx) => {
        await ctx.answerCbQuery('Deleted');
    });

    bot.action('amt_conf', async (ctx) => {
        await ctx.answerCbQuery('Confirming amount...');
        await ctx.reply('⚠️ Abhi payment gateway connect nahi hai, kripya admin se sampark karein.');
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