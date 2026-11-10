const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.action('open_shop', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}

    await ctx.editMessageText(
      '🛍️ **Select a Category / Product:**\n\nChoose from our high-performance panels below:',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('💧 Drip Client', 'prod_dripclient')],
          [Markup.button.callback('⚡ Drake Panel', 'prod_drake')],
          [Markup.button.callback('🔥 Phantom Mod', 'prod_phantom')],
          [Markup.button.callback('🔙 Back to Main Menu', 'main_menu')]
        ])
      }
    );
  });

  bot.action('prod_dripclient', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    await ctx.editMessageText(
      '💧 **Drip Client Options & Pricing:**\n\nSelect your desired duration:',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('1 Hour - ₹9', 'buy_dripclient_1h')],
          [Markup.button.callback('6 Hours - ₹66', 'buy_dripclient_6h')],
          [Markup.button.callback('🔙 Back to Shop', 'open_shop')]
        ])
      }
    );
  });

  bot.action('prod_drake', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    await ctx.editMessageText(
      '⚡ **Drake Panel Options & Pricing:**\n\nSelect your desired duration:',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('1 Day - ₹150', 'buy_drake_1d')],
          [Markup.button.callback('7 Days - ₹500', 'buy_drake_7d')],
          [Markup.button.callback('🔙 Back to Shop', 'open_shop')]
        ])
      }
    );
  });

  bot.action('prod_phantom', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    await ctx.editMessageText(
      '🔥 **Phantom Mod Options & Pricing:**\n\nSelect your desired duration:',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('1 Day - ₹200', 'buy_phantom_1d')],
          [Markup.button.callback('30 Days - ₹999', 'buy_phantom_30d')],
          [Markup.button.callback('🔙 Back to Shop', 'open_shop')]
        ])
      }
    );
  });
};