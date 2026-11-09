const { backButton } = require('../utils/keyboards');

function setupProfileHandler(bot) {
  bot.action('my_profile', (ctx) => {
    const userId = ctx.from.id;
    const name = ctx.from.first_name;

    const profileText = `
👑 **— YOUR PROFILE —** 👑

• **User ID:** ${userId}
👑 **Name:** ${name}
📞 **Phone:** 919694421148
🍎 **Account:** 🔵 Regular | 🟢 Active

💰 **— Balance —**
🟢 **Current:** ₹80

📊 **— Statistics —**
🛒 **Orders:** 8
💸 **Spent:** ₹346

Joined: 2026-10-23
🎁 **Referral Earned:** ₹0
    `;

    ctx.editMessageText(profileText, {
      parse_mode: 'Markdown',
      ...backButton
    });
  });
}

module.exports = { setupProfileHandler };