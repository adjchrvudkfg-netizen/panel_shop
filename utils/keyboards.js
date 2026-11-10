const { Markup } = require('telegraf');

function getMainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🛍️ Shop', 'shop')],
    [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📦 My Orders', 'my_orders')],
    [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.url('PAID_PUSH 💯', 'https://t.me/adityachoudhary5')],
    [Markup.button.callback('🎧 Support', 'support')]
  ]);
}

function getNumPadKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('💰 1', 'num_1'), Markup.button.callback('💰 2', 'num_2'), Markup.button.callback('💰 3', 'num_3')],
    [Markup.button.callback('💰 4', 'num_4'), Markup.button.callback('💰 5', 'num_5'), Markup.button.callback('💰 6', 'num_6')],
    [Markup.button.callback('💰 7', 'num_7'), Markup.button.callback('💰 8', 'num_8'), Markup.button.callback('💰 9', 'num_9')],
    [Markup.button.callback('❌ Delete', 'num_del'), Markup.button.callback('💰 0', 'num_0'), Markup.button.callback('✅ Confirm', 'num_confirm')],
    [Markup.button.callback('⬅️ Back', 'main_menu')]
  ]);
}

module.exports = { getMainMenu, getNumPadKeyboard };