const { productListKeyboard, durationKeyboard, backButton } = require('../utils/keyboards');

function setupShopHandler(bot) {
  // Open Shop Menu (Image 2)
  bot.action('shop_menu', (ctx) => {
    ctx.editMessageText('🛒 **Apna Product Chunlo!** 👇', {
      parse_mode: 'Markdown',
      ...productListKeyboard
    });
  });

  // Select Specific Product (Image 3 - Aim Hack Example)
  bot.action('prod_aim_hack', (ctx) => {
    const productText = `
🎯 **AIM HACK { MAIN ID SAFE }**

Website:
🔗 https://client.aimhack.shop/

Select Duration:
    `;
    ctx.editMessageText(productText, {
      parse_mode: 'Markdown',
      ...durationKeyboard
    });
  });

  // Mock Purchase action
  bot.action('buy_1d', (ctx) => {
    ctx.answerCbQuery('Processing order...');
    ctx.reply(
      '❌ Abhi key generate nahi ho paayi, isliye aapka balance deduct nahi hua. Thodi der baad dobara try karein.'
    );
  });
}

module.exports = { setupShopHandler };