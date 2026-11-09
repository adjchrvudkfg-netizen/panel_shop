const { keypadKeyboard } = require('../utils/keyboards');

function setupWalletHandler(bot) {
  bot.action('add_balance', (ctx) => {
    const walletText = `
🏦 **Custom Amount**
-----------------------------------
Method: 🟢 **UPI (ZapUPI)**
Min: ₹1 | Max: ₹5,000

Apna amount enter karo aur payment complete karke balance add karwao.

🔽 **Amount:** ₹0 (~$0.00)

🔽 **Amount type karo – buttons se:**
    `;
    ctx.editMessageText(walletText, {
      parse_mode: 'Markdown',
      ...keypadKeyboard
    });
  });
}

module.exports = { setupWalletHandler };