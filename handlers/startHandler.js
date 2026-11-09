const { mainMenuKeyboard } = require('../utils/keyboards');

function setupStartHandler(bot) {
  bot.start((ctx) => {
    const userName = ctx.from.first_name || 'User';
    const userId = ctx.from.id;
    const walletBalance = 80; // Dummy balance for mock UI

    const welcomeText = `
🌸 **- VETLAM PANEL SHOP -** 🌸

🎀 Hello, ${userName}!

🛡️ **Premium digital keys, instant delivery.**

- 🛒 **Wide product catalog**
- ⚡ **Instant key delivery**
- 💳 **Multiple payment gateways**
- 👥 **Referrals & spin-to-win**
- 🛡️ **24/7 admin support**

Tap any button below to begin.
-----------------------------------
👤 **User ID:** ${userId}
💰 **Wallet Balance:** ₹80 (~$0.85)
    `;

    ctx.replyWithMarkdown(welcomeText, mainMenuKeyboard);
  });

  bot.action('main_menu', (ctx) => {
    ctx.editMessageText(
      `🌸 **- VETLAM PANEL SHOP -** 🌸\n\nTap any button below to begin.`,
      { parse_mode: 'Markdown', ...mainMenuKeyboard }
    );
  });
}

module.exports = { setupStartHandler };