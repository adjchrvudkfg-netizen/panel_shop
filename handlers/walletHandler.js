const { Markup } = require('telegraf');
const { generateUpiQrUrl } = require('../services/paymentService');

// User ke current typing amount ko track karne ke liye session memory
const userAmounts = {};

function setupWalletHandler(bot) {
    // 1. Add Balance dabane par keypad khulna (Amount = 0 se shuru)
    bot.action('add_balance', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            const userId = ctx.from.id;
            userAmounts[userId] = '0';
            await showKeypad(ctx, '0');
        } catch (error) {
            console.error('Error in add_balance:', error);
        }
    });

    // 2. Number Keypad Handlers (1 se 9 aur 0)
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach((num) => {
        bot.action(`amt_${num}`, async (ctx) => {
            await ctx.answerCbQuery();
            const userId = ctx.from.id;
            let current = userAmounts[userId] || '0';
            
            if (current === '0') {
                current = num;
            } else {
                current += num;
            }
            
            // Maximum limit ₹50,000
            if (parseInt(current, 10) > 50000) {
                current = '50000';
            }
            
            userAmounts[userId] = current;
            await updateKeypad(ctx, current);
        });
    });

    // 3. Delete / Backspace Button
    bot.action('amt_del', async (ctx) => {
        await ctx.answerCbQuery();
        const userId = ctx.from.id;
        let current = userAmounts[userId] || '0';
        
        if (current.length > 1) {
            current = current.slice(0, -1);
        } else {
            current = '0';
        }
        
        userAmounts[userId] = current;
        await updateKeypad(ctx, current);
    });

    // 4. Confirm Button -> Generates FamPay QR Code
    bot.action('amt_conf', async (ctx) => {
        await ctx.answerCbQuery();
        const userId = ctx.from.id;
        const rawAmount = userAmounts[userId] || '0';
        const amount = parseInt(rawAmount, 10);

        if (isNaN(amount) || amount <= 0) {
            return ctx.reply('⚠️ Kripya kam se kam ₹1 ya usse zyada amount enter karein.');
        }

        // FamPay UPI QR generate karein (`9694421148@fam`)
        try {
            const { qrImageUrl, upiString } = generateUpiQrUrl(amount, '9694421148@fam', 'Aditya');

            const paymentText = 
`🏛️ **FAMCORP PAYMENT GATEWAY**

──────────────────
👤 **UPI ID:** \`9694421148@fam\`
💰 **Amount:** ₹${amount}
──────────────────

1. Is QR code ko apne **FamPay** ya kisi bhi UPI app se scan karein.
2. Payment complete hone ke baad niche **"✅ Payment Done"** button par click karein.`;

            await ctx.replyWithPhoto(qrImageUrl, {
                caption: paymentText,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('⚡ Pay via UPI App', upiString)],
                    [Markup.button.callback(`✅ Payment Done (₹${amount})`, `verify_pay_${amount}`)],
                    [Markup.button.callback('◀️ Cancel / Back', 'add_balance')]
                ])
            });
        } catch (err) {
            console.error('QR Generation Error:', err);
            await ctx.reply('⚠️ QR generate karne me kuch dikkat aayi. Kripya dubara try karein.');
        }
    });

    // 5. Payment Verification Trigger
    bot.action(/^verify_pay_(\d+)$/, async (ctx) => {
        await ctx.answerCbQuery('Checking payment status...');
        const amount = ctx.match[1];
        
        await ctx.reply(`🔍 Payment verification initiated for ₹${amount}.\n\n⚠️ Agar aapne payment kar diya hai, toh kripya admin (@adityachoudhary5) ko screenshot bhejiye, turant balance add kar diya jayega!`);
    });

    bot.action('my_orders', async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.reply('📦 You have no active orders right now.');
        } catch (error) {
            console.error('Error in my_orders:', error);
        }
    });
}

// Helper functions for Keypad UI
async function showKeypad(ctx, amount) {
    const text = 
`🏛️ **Custom Amount**

──────────────────
Method: 💚 FamPay UPI (9694421148@fam)
Min: ₹1 | Max: ₹50,000
──────────────────

Apna amount enter karo aur payment complete karke balance add karwao.

🔻 Amount: ₹${amount} (~$${(amount * 0.012).toFixed(2)})
🔻 Amount type karo – buttons se:`;

    await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        ...getKeypadMarkup()
    });
}

async function updateKeypad(ctx, amount) {
    const text = 
`🏛️ **Custom Amount**

──────────────────
Method: 💚 FamPay UPI (9694421148@fam)
Min: ₹1 | Max: ₹50,000
──────────────────

Apna amount enter karo aur payment complete karke balance add karwao.

🔻 Amount: ₹${amount} (~$${(amount * 0.012).toFixed(2)})
🔻 Amount type karo – buttons se:`;

    try {
        await ctx.editMessageText(text, {
            parse_mode: 'Markdown',
            ...getKeypadMarkup()
        });
    } catch (e) {
        // Ignore error if text hasn't changed
    }
}

function getKeypadMarkup() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('💰 1', 'amt_1'), Markup.button.callback('💰 2', 'amt_2'), Markup.button.callback('💰 3', 'amt_3')],
        [Markup.button.callback('💰 4', 'amt_4'), Markup.button.callback('💰 5', 'amt_5'), Markup.button.callback('💰 6', 'amt_6')],
        [Markup.button.callback('💰 7', 'amt_7'), Markup.button.callback('💰 8', 'amt_8'), Markup.button.callback('💰 9', 'amt_9')],
        [Markup.button.callback('❌ Delete', 'amt_del'), Markup.button.callback('💰 0', 'amt_0'), Markup.button.callback('✅ Confirm', 'amt_conf')],
        [Markup.button.callback('◀️ Back', 'back_to_start')]
    ]);
}

module.exports = { setupWalletHandler };