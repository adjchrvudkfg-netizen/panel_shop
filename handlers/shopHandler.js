const { Markup } = require('telegraf');

function setupShopHandler(bot, users) {
  bot.action('shop', (ctx) => {
    ctx.answerCbQuery();
    const text = `🛍️ **- ADITYA PANEL SHOP -** 🛍️\n\nPlease select a product below:`;
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('💀 Phantom Panel', 'product_phantom')],
        [Markup.button.callback('💧 Drip Client', 'product_drip')],
        [Markup.button.callback('⬅️ Back to Main Menu', 'main_menu')]
      ])
    });
  });

  bot.action('my_orders', (ctx) => {
    ctx.answerCbQuery();
    const userId = ctx.from.id;
    const user = users[userId] || { balance: 0, orders: [] };

    if (user.orders.length === 0) {
      return ctx.editMessageText('📦 **My Orders**\n\nAapne abhi tak koi order nahi kiya h.', {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back to Main Menu', 'main_menu')]])
      });
    }

    let text = `📦 **YOUR ORDERS HISTORY**\n\n`;
    user.orders.forEach((order, index) => {
      text += `${index + 1}. **${order.product}** (${order.plan})\n🔑 Key: \`${order.key}\`\n📅 Date: ${order.date}\n\n`;
    });

    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back to Main Menu', 'main_menu')]])
    });
  });
}

module.exports = { setupShopHandler };