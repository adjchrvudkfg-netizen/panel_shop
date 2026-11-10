const { Markup } = require('telegraf');
const users = {}; // Ya aapka database module

function setupProfileHandler(bot, userDb) {
  bot.action('my_profile', (ctx) => {
    ctx.answerCbQuery();
    const userId = ctx.from.id;
    const user = userDb[userId] || { balance: 0, orders: [] };

    const text = `👤 **USER PROFILE**\n\n` +
                 `🆔 **User ID:** \`${userId}\`\n` +
                 `👤 **Name:** ${ctx.from.first_name || 'N/A'}\n` +
                 `🏷️ **Username:** @${ctx.from.username || 'None'}\n` +
                 `💰 **Wallet Balance:** ₹${user.balance}\n` +
                 `📦 **Total Orders:** ${user.orders.length}`;

    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back to Main Menu', 'main_menu')]])
    });
  });
}

module.exports = { setupProfileHandler };