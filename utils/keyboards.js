const { Markup } = require('telegraf');

// Main Menu Keyboard (Image 1)
const mainMenuKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('🛍️ Shop', 'shop_menu')],
  [Markup.button.callback('💳 Add Balance', 'add_balance'), Markup.button.callback('📋 My Orders', 'my_orders')],
  [Markup.button.callback('👤 My Profile', 'my_profile'), Markup.button.callback('▶️ How To Use', 'how_to_use')],
  [Markup.button.callback('🔗 Referral', 'referral_menu'), Markup.button.callback('🎡 Daily Spin', 'daily_spin')],
  [Markup.button.callback('💬 Support', 'support_menu')],
  [Markup.button.callback('💎 Selling Proof', 'selling_proof'), Markup.button.callback('📊 Leaderboard', 'leaderboard')]
]);

// Back to Menu Button
const backButton = Markup.inlineKeyboard([
  [Markup.button.callback('🛍️ Back', 'main_menu')]
]);

// Product List Keyboard (Image 2)
const productListKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('🤖 PRIME HOOK', 'prod_prime_hook')],
  [Markup.button.callback('👹 HAXX-CKER FF ROOT', 'prod_haxx')],
  [Markup.button.callback('🎯 AIM HACK { MAIN ID SAFE }', 'prod_aim_hack')],
  [Markup.button.callback('💎 DRIP WIRE EXTERNAL 🛠️', 'prod_drip')],
  [Markup.button.callback('🛍️ Back', 'main_menu')]
]);

// Duration Selection Keyboard (Image 3)
const durationKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('⏱️ 1 Hour - ₹12 (~$0.13)', 'buy_1h')],
  [Markup.button.callback('⏱️ 1 Day - ₹80 (~$0.85)', 'buy_1d')],
  [Markup.button.callback('⏱️ 7 Days - ₹203 (~$2.16)', 'buy_7d')],
  [Markup.button.callback('▶️ Watch Demo', 'watch_demo')],
  [Markup.button.callback('🛍️ Back', 'shop_menu')]
]);

// Custom Amount Keypad for Wallet (Image 4)
const keypadKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('💰 1', 'num_1'), Markup.button.callback('💰 2', 'num_2'), Markup.button.callback('💰 3', 'num_3')],
  [Markup.button.callback('💰 4', 'num_4'), Markup.button.callback('💰 5', 'num_5'), Markup.button.callback('💰 6', 'num_6')],
  [Markup.button.callback('💰 7', 'num_7'), Markup.button.callback('💰 8', 'num_8'), Markup.button.callback('💰 9', 'num_9')],
  [Markup.button.callback('❌ Delete', 'num_del'), Markup.button.callback('💰 0', 'num_0'), Markup.button.callback('✅ Confirm', 'num_conf')],
  [Markup.button.callback('🛍️ Back', 'main_menu')]
]);

module.exports = {
  mainMenuKeyboard,
  backButton,
  productListKeyboard,
  durationKeyboard,
  keypadKeyboard
};