const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.start(async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}

    const userName = ctx.from.first_name || 'User';
    const userId = ctx.from.id;

    ctx.reply(
      `=== - ADITYA PANEL SHOP - ===\n\nHello, ${userName}!\n\nPremium digital keys, instant delivery.\n\nTap any button below to begin.\n\n------------------\nUser ID: ${userId}\nWallet Balance: ₹0`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🛍️ Shop', 'open_shop')],
          [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📜 My Orders', 'my_orders')],
          [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.url('🔥 PAID_PUSH 💯', 'https://t.me/TATSER_PAID_PUSH')],
          [Markup.button.url('🎧 Support', 'https://t.me/ADITYACHOUDHARY5')]
        ])
      }
    );
  });

  bot.action('my_profile', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const userId = ctx.from.id;
    const userName = ctx.from.first_name || 'User';

    await ctx.editMessageText(
      `User Profile:\n\nUser ID: ${userId}\nName: ${userName}\nBalance: ₹0\n\nCheck your active licenses or orders below:`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📜 My Orders', 'my_orders')],
          [Markup.button.callback('🔙 Back to Main Menu', 'main_menu')]
        ])
      }
    );
  });

  bot.action('main_menu', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const userName = ctx.from.first_name || 'User';
    const userId = ctx.from.id;

    await ctx.editMessageText(
      `=== - ADITYA PANEL SHOP - ===\n\nHello, ${userName}!\n\nPremium digital keys, instant delivery.\n\nTap any button below to begin.\n\n------------------\nUser ID: ${userId}\nWallet Balance: ₹0`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🛍️ Shop', 'open_shop')],
          [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📜 My Orders', 'my_orders')],
          [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.url('🔥 PAID_PUSH 💯', 'https://t.me/TATSER_PAID_PUSH')],
          [Markup.button.url('🎧 Support', 'https://t.me/ADITYACHOUDHARY5')]
        ])
      }
    );
  });
};