const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.start(async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}

    const userName = ctx.from.first_name || 'User';
    const userId = ctx.from.id;

    ctx.reply(
      `═══ - ADITYA PANEL SHOP - ═══\n\n🌸 Hello, ${userName}!\n\n☆ Premium digital keys, instant delivery.\n\nTap any button below to begin.\n\n──────────────────\n👤 User ID: \`${userId}\`\n💰 Wallet Balance: ₹0`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🛍️ Shop', 'open_shop')],
          [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📜 My Orders', 'my_orders')],
          [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.url('🔥 PAID_PUSH 💯', 'https://t.me/TATSER_PAID_PUSH')],
          [Markup.button.url('🎧 Support', 'https://t.me/ADITYACHOUDHARY5')]
        ])
      }
    );
  });

  // Profile Button Fix
  bot.action('my_profile', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const userId = ctx.from.id;
    const userName = ctx.from.first_name || 'User';

    await ctx.editMessageText(
      `👤 **User Profile:**\n\n🆔 **User ID:** \`${userId}\`\n👤 **Name:** ${userName}\n💰 **Balance:** ₹0\n\n📦 Check your active licenses or orders below:`,
      {
        parse_mode: 'Markdown',
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
      `═══ - ADITYA PANEL SHOP - ═══\n\n🌸 Hello, ${userName}!\n\n☆ Premium digital keys, instant delivery.\n\nTap any button below to begin.\n\n──────────────────\n👤 User ID: \`${userId}\`\n💰 Wallet Balance: ₹0`,
      {
        parse_mode: 'Markdown',
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