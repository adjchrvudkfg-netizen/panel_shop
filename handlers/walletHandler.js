const { Markup } = require('telegraf');

// Aap yahan apni Telegram Admin ID daal dein (jaise: 123456789)
const ADMIN_CHAT_ID = process.env.ADMIN_ID || '8805135936'; 

module.exports = (bot) => {
  // Product ya Add Balance select hone par QR / Payment info dikhana
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
      `🛒 **Payment Order Summary:**\n\n📦 **Product:** ${product} (${duration})\n💰 **Amount:** ₹${price}\n🆔 **Ref ID:** \`${refId}\`\n\n💳 **Pay via FamPay UPI:**\n\`9694421148@fam\`\n\n1. Scan QR or pay to UPI above.\n2. Click 'Payment Done' below after paying.`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('✅ Payment Done', `verify_${refId}_${price}_${product}`)],
          [Markup.button.callback('🔙 Back', 'open_shop')]
        ])
      }
    );
  });

  bot.action('add_balance', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const refId = 'BAL_' + Math.floor(100000 + Math.random() * 900000);
    
    await ctx.editMessageText(
      `💳 **Add Balance to Wallet:**\n\nPay to FamPay UPI: \`9694421148@fam\`\n🆔 **Ref ID:** \`${refId}\`\n\nPay any amount and click below to notify admin for approval.`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('✅ Payment Done', `verify_${refId}_5_BalanceTopUp`)],
          [Markup.button.callback('🔙 Back to Main Menu', 'main_menu')]
        ])
      }
    );
  });

  // User jab Payment Done dabayega, tab Admin ke paas approval request jayegi
  bot.action(/verify_(.+)_(\d+)_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const refId = ctx.match[1];
    const amount = ctx.match[2];
    const product = ctx.match[3];
    const userId = ctx.from.id;
    const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;

    await ctx.editMessageText(
      `⏳ **Aapka payment request admin ko bhej diya gaya hai. Verification ke baad key/balance add ho jayega!**\n\n🆔 Ref ID: \`${refId}\``,
      { parse_mode: 'Markdown' }
    );

    // Admin (`@ADITYACHOUDHARY5` / Admin ID) ko approval request bhejna
    try {
      await bot.telegram.sendMessage(
        ADMIN_CHAT_ID,
        `🔔 **New Payment Verification Request!**\n\n👤 **User:** ${username} (\`[${userId}](tg://user?id=${userId})\`)\n📦 **Item:** ${product}\n💰 **Amount:** ₹${amount}\n🆔 **Ref ID:** \`${refId}\``,
        {
          parse_mode: 'Markdown',
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

    // User ko key bhejna
    try {
      await bot.telegram.sendMessage(
        userId,
        `🎉 **Payment Approved by Admin!**\n\n🆔 Ref ID: \`${refId}\`\n📦 Product: ${product}\n\n🔑 **Your License Key:**\n\`${licenseKey}\`\n\nThank you for purchasing!`,
        { parse_mode: 'Markdown' }
      );
    } catch (e) {}

    await ctx.editMessageText(`✅ **Approved** for User ID: \`${userId}\` | Ref: \`${refId}\``, { parse_mode: 'Markdown' });
  });

  // Admin jab Reject par click karega
  bot.action(/reject_(\d+)_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery('Rejected.').catch(() => {}); } catch (e) {}
    const userId = ctx.match[1];
    const refId = ctx.match[2];

    try {
      await bot.telegram.sendMessage(
        userId,
        `❌ **Payment Rejected / Failed**\n\nYour payment for Ref ID: \`${refId}\` was rejected by admin. Please contact support @ADITYACHOUDHARY5 if this was a mistake.`,
        { parse_mode: 'Markdown' }
      );
    } catch (e) {}

    await ctx.editMessageText(`❌ **Rejected** for User ID: \`${userId}\` | Ref: \`${refId}\``, { parse_mode: 'Markdown' });
  });

  bot.action('my_orders', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    await ctx.editMessageText(
      `📜 **Your Orders:**\n\nYou have no active or past orders yet.`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔙 Back to Main Menu', 'main_menu')]
        ])
      }
    );
  });
};