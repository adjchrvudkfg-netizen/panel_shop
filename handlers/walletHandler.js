const { Markup } = require('telegraf');

// Aapki Admin ID jiske paas approval request jayegi
const ADMIN_CHAT_ID = process.env.ADMIN_ID || '8805135936'; 

module.exports = (bot) => {
  // Product select karne par QR / Payment details aur Ref ID dikhana
  bot.action(/buy_(.+)_([^_]+)/, async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}

    const product = ctx.match[1].toUpperCase();
    const duration = ctx.match[2];
    const refId = 'REF_' + Math.floor(100000 + Math.random() * 900000);

    let price = '9';
    if (duration === '6h') price = '66';
    if (duration === '1d' && product === 'DRAKE') price = '150';
    if (duration === '7d') price = '500';
    if (duration === '1d' && product === 'PHANTOM') price = '200';
    if (duration === '30d') price = '999';

    await ctx.editMessageText(
      `🛒 Payment Order Summary:\n\nProduct: ${product} (${duration})\nAmount: ₹${price}\nRef ID: ${refId}\n\nPay via FamPay UPI: 9694421148@fam\n\n1. Scan QR or pay to the UPI ID above.\n2. Click 'Payment Done' after paying.`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('✅ Payment Done', `verify_${refId}_${price}_${product}`)],
          [Markup.button.callback('❌ Cancel', 'open_shop')]
        ])
      }
    );
  });

  // Add Balance button click handler
  bot.action('add_balance', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const refId = 'BAL_' + Math.floor(100000 + Math.random() * 900000);
    
    await ctx.editMessageText(
      `💳 Add Balance to Wallet:\n\nPay to FamPay UPI: 9694421148@fam\nRef ID: ${refId}\n\nPay any amount and click below to notify admin for approval.`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('✅ Payment Done', `verify_${refId}_5_BalanceTopUp`)],
          [Markup.button.callback('🔙 Back to Main Menu', 'main_menu')]
        ])
      }
    );
  });

  // Jab user 'Payment Done' par click karega, tab admin ko approval request jayegi
  bot.action(/verify_(.+)_(\d+)_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const refId = ctx.match[1];
    const amount = ctx.match[2];
    const product = ctx.match[3];
    const userId = ctx.from.id;
    const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;

    await ctx.editMessageText(
      `⏳ Aapka payment request admin ko bhej diya gaya hai. Verification ke baad key/balance add ho jayega!\n\nRef ID: ${refId}`
    );

    // Admin ke paas approval request bhejna
    try {
      await bot.telegram.sendMessage(
        ADMIN_CHAT_ID,
        `🔔 New Payment Verification Request!\n\nUser: ${username} (ID: ${userId})\nItem: ${product}\nAmount: ₹${amount}\nRef ID: ${refId}`,
        {
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback('✅ Approve & Give Key', `approve_${userId}_${refId}_${product}`),
              Markup.button.callback('❌ Reject', `reject_${userId}_${refId}`)
            ]
          ])
        }
      );
    } catch (err) {
      console.error('Failed to send message to admin:', err);
    }
  });

  // Admin jab Approve par click karega
  bot.action(/approve_(\d+)_(.+)_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery('Approved successfully!').catch(() => {}); } catch (e) {}
    const userId = ctx.match[1];
    const refId = ctx.match[2];
    const product = ctx.match[3];

    const licenseKey = 'KEY-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    // User ko key deliver karna
    try {
      await bot.telegram.sendMessage(
        userId,
        `🎉 Payment Approved by Admin!\n\nRef ID: ${refId}\nProduct: ${product}\n\nYour License Key:\n${licenseKey}\n\nThank you for purchasing!`
      );
    } catch (e) {}

    await ctx.editMessageText(`✅ Approved for User ID: ${userId} | Ref: ${refId}`);
  });

  // Admin jab Reject par click karega
  bot.action(/reject_(\d+)_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery('Rejected.').catch(() => {}); } catch (e) {}
    const userId = ctx.match[1];
    const refId = ctx.match[2];

    try {
      await bot.telegram.sendMessage(
        userId,
        `❌ Payment Rejected / Failed\n\nYour payment for Ref ID: ${refId} was rejected by admin. Please contact support @ADITYACHOUDHARY5 if this was a mistake.`
      );
    } catch (e) {}

    await ctx.editMessageText(`❌ Rejected for User ID: ${userId} | Ref: ${refId}`);
  });

  bot.action('my_orders', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    await ctx.editMessageText(
      `📜 Your Orders:\n\nYou have no active or past orders yet.`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔙 Back to Main Menu', 'main_menu')]
        ])
      }
    );
  });
};