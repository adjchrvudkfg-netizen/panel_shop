const { Markup } = require('telegraf');

module.exports = (bot) => {
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
      `🛒 **Payment Order Summary:**\n\n📦 **Product:** ${product} (${duration})\n💰 **Amount:** ₹${price}\n🆔 **Ref ID:** \`${refId}\`\n\n💳 **Pay via FamPay UPI:**\n\`9694421148@fam\`\n\n*(Pay to the UPI ID above, then click 'Submit UTR' to verify payment)*`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('✅ Submit UTR / Payment Done', `verify_${refId}_${price}`)],
          [Markup.button.callback('❌ Cancel', 'open_shop')]
        ])
      }
    );
  });

  bot.action(/verify_(.+)_(\d+)/, async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const refId = ctx.match[1];
    const amount = ctx.match[2];

    // Automatic UTR / Payment Validation simulation
    // (Aap yahan real payment gateway ya database check laga sakte hain)
    const isPaymentValid = true; // Agar UTR match hua toh true

    if (isPaymentValid) {
      const licenseKey = 'KEY-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      await ctx.editMessageText(
        `✅ **Payment Verified Successfully!**\n\n🆔 **Ref ID:** \`${refId}\`\n💰 **Amount Paid:** ₹${amount}\n\n🔑 **Your License Key:**\n\`${licenseKey}\`\n\nThank you for purchasing from Aditya Panel Shop!`,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('🏠 Main Menu', 'main_menu')]
          ])
        }
      );
    } else {
      await ctx.editMessageText(
        `❌ **Payment Verification Failed!**\n\nNo matching transaction found for Ref ID: \`${refId}\`. Please check your payment or contact support.`,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('🔄 Try Again', 'open_shop')],
            [Markup.button.url('🎧 Support', 'https://t.me/ADITYACHOUDHARY5')]
          ])
        }
      );
    }
  });

  bot.action('add_balance', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    await ctx.editMessageText(
      `💳 **Add Balance to Wallet:**\n\nPay to FamPay UPI: \`9694421148@fam\`\nSend screenshot & UTR to support for balance top-up.`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔙 Back to Main Menu', 'main_menu')]
        ])
      }
    );
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