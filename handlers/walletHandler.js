const { Markup } = require('telegraf');

const ADMIN_CHAT_ID = process.env.ADMIN_ID || '8805135936'; 

// Temporary session store for amount typing
const userSessions = {};

module.exports = (bot) => {
  // Direct Product Buy -> QR Show with Admin Approval
  bot.action(/buy_(.+)_([^_]+)/, async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}

    const product = ctx.match[1].toUpperCase();
    const duration = ctx.match[2];
    const refId = 'REF_' + Math.floor(100000 + Math.random() * 900000);

    let price = '9';
    if (duration === '6h') price = '66';
    if (duration === '1d' && product === 'DRAKE') price = '150';
    if (duration === '7d') price = '500';
    if (duration === '1d' && product === 'PHANTOM') price = '200';
    if (duration === '30d') price = '999';

    await ctx.editMessageText(
      `🛒 Payment Order Summary:\n\nProduct: ${product} (${duration})\nAmount: ₹${price}\nRef ID: ${refId}\n\nMethod: FamPay UPI (9694421148@fam)\n\n1. Scan QR code below or pay to UPI ID.\n2. Click 'Payment Done' after paying.`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📷 View QR Code', `show_qr_${refId}_${price}_${product}`)],
          [Markup.button.callback('✅ Payment Done', `verify_${refId}_${price}_${product}`)],
          [Markup.button.callback('❌ Cancel', 'open_shop')]
        ])
      }
    );
  });

  // Show QR Image handler
  bot.action(/show_qr_(.+)_(\d+)_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const refId = ctx.match[1];
    const price = ctx.match[2];
    const product = ctx.match[3];

    // Aap yahan apni FamPay QR image ka direct URL ya file id de sakte hain
    const qrImageUrl = 'https://i.ibb.co/1z1z1z1/fampay-qr.jpg'; // Placeholder QR image

    try {
      await ctx.replyWithPhoto(qrImageUrl, {
        caption: `📷 FamPay QR Code\nAmount: ₹${price}\nRef ID: ${refId}\n\nScan this QR to pay, then click 'Payment Done' in the shop menu.`,
        ...Markup.inlineKeyboard([
          [Markup.button.callback('✅ Payment Done', `verify_${refId}_${price}_${product}`)],
          [Markup.button.callback('🔙 Back to Shop', 'open_shop')]
        ])
      });
    } catch (err) {
      await ctx.reply(`FamPay UPI: 9694421148@fam\nAmount: ₹${price}\nRef ID: ${refId}`);
    }
  });

  // Add Balance: Open Numeric Keypad (1,2,3,4,5,6,7,8,9,0)
  bot.action('add_balance', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const userId = ctx.from.id;
    userSessions[userId] = '0';

    await renderKeypad(ctx, '0');
  });

  // Keypad button actions
  bot.action(/kp_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const userId = ctx.from.id;
    const action = ctx.match[1];

    if (!userSessions[userId]) userSessions[userId] = '0';

    if (action === 'del') {
      userSessions[userId] = userSessions[userId].slice(0, -1) || '0';
    } else if (action === 'clear') {
      userSessions[userId] = '0';
    } else {
      // Number clicked
      if (userSessions[userId] === '0') {
        userSessions[userId] = action;
      } else {
        userSessions[userId] += action;
      }
    }

    await renderKeypad(ctx, userSessions[userId]);
  });

  async function renderKeypad(ctx, amount) {
    const text = `🏛️ Custom Amount\n\nMethod: FamPay UPI (9694421148@fam)\nMin: ₹1 | Max: ₹5,000\n\nApna amount enter karo aur payment complete karke balance add karwao.\n\n🔻 Amount: ₹${amount}`;

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('💰 1', 'kp_1'), Markup.button.callback('💰 2', 'kp_2'), Markup.button.callback('💰 3', 'kp_3')],
      [Markup.button.callback('💰 4', 'kp_4'), Markup.button.callback('💰 5', 'kp_5'), Markup.button.callback('💰 6', 'kp_6')],
      [Markup.button.callback('💰 7', 'kp_7'), Markup.button.callback('💰 8', 'kp_8'), Markup.button.callback('💰 9', 'kp_9')],
      [Markup.button.callback('❌ Delete', 'kp_del'), Markup.button.callback('💰 0', 'kp_0'), Markup.button.callback('✅ Confirm', 'kp_confirm')],
      [Markup.button.callback('🔙 Back', 'main_menu')]
    ]);

    try {
      await ctx.editMessageText(text, keyboard);
    } catch (e) {}
  }

  // Keypad Confirm -> Generate QR and Ref for Add Balance
  bot.action('kp_confirm', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const userId = ctx.from.id;
    const amount = parseInt(userSessions[userId] || '0', 10);

    if (amount < 1) {
      try { await ctx.answerCbQuery('Kripya kam se kam ₹1 ya usse zyada amount enter karein.'); } catch (e) {}
      return;
    }

    const refId = 'BAL_' + Math.floor(100000 + Math.random() * 900000);

    await ctx.editMessageText(
      `🛒 Add Balance Summary:\n\nAmount: ₹${amount}\nRef ID: ${refId}\n\nPay via FamPay UPI: 9694421148@fam\n\n1. Pay the exact amount to the UPI above.\n2. Click 'Payment Done' below.`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📷 View QR Code', `show_qr_${refId}_${amount}_BalanceTopUp`)],
          [Markup.button.callback('✅ Payment Done', `verify_${refId}_${amount}_BalanceTopUp`)],
          [Markup.button.callback('🔙 Back', 'add_balance')]
        ])
      }
    );
  });

  // Admin Approval Trigger on Payment Done
  bot.action(/verify_(.+)_(\d+)_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    const refId = ctx.match[1];
    const amount = ctx.match[2];
    const product = ctx.match[3];
    const userId = ctx.from.id;
    const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;

    await ctx.editMessageText(
      `⏳ Aapka payment request admin ko bhej diya gaya hai. Verification ke baad key/balance add ho jayega!\n\nRef ID: ${refId}`
    );

    try {
      await bot.telegram.sendMessage(
        ADMIN_CHAT_ID,
        `🔔 New Payment Verification Request!\n\nUser: ${username} (ID: ${userId})\nItem/Type: ${product}\nAmount: ₹${amount}\nRef ID: ${refId}`,
        {
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback('✅ Approve & Give Key', `approve_${userId}_${refId}_${product}_${amount}`),
              Markup.button.callback('❌ Reject', `reject_${userId}_${refId}`)
            ]
          ])
        }
      );
    } catch (err) {
      console.error('Failed to send message to admin:', err);
    }
  });

  // Admin Approve Action
  bot.action(/approve_(\d+)_(.+)_(.+)_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery('Approved successfully!').catch(() => {}); } catch (e) {}
    const userId = ctx.match[1];
    const refId = ctx.match[2];
    const product = ctx.match[3];
    const amount = ctx.match[4];

    const licenseKey = 'KEY-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    try {
      if (product === 'BalanceTopUp') {
        await bot.telegram.sendMessage(
          userId,
          `🎉 Payment Approved by Admin!\n\nRef ID: ${refId}\nAdded Balance: ₹${amount}\n\nThank you for topping up!`
        );
      } else {
        await bot.telegram.sendMessage(
          userId,
          `🎉 Payment Approved by Admin!\n\nRef ID: ${refId}\nProduct: ${product}\n\nYour License Key:\n${licenseKey}\n\nThank you for purchasing!`
        );
      }
    } catch (e) {}

    await ctx.editMessageText(`✅ Approved for User ID: ${userId} | Ref: ${refId}`);
  });

  // Admin Reject Action
  bot.action(/reject_(\d+)_(.+)/, async (ctx) => {
    try { await ctx.answerCbQuery('Rejected.').catch(() => {}); } catch (e) {}
    const userId = ctx.match[1];
    const refId = ctx.match[2];

    try {
      await bot.telegram.sendMessage(
        userId,
        `❌ Payment Rejected / Failed\n\nYour payment for Ref ID: ${refId} was rejected by admin. Please contact support @ADITYACHOUDHARY5 if this was a mistake.`
      );
    } catch (e) {}

    await ctx.editMessageText(`❌ Rejected for User ID: ${userId} | Ref: ${refId}`);
  });

  bot.action('my_orders', async (ctx) => {
    try { await ctx.answerCbQuery().catch(() => {}); } catch (e) {}
    await ctx.editMessageText(
      `📜 Your Orders:\n\nYou have no active or past orders yet.`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔙 Back to Main Menu', 'main_menu')]
        ])
      }
    );
  });
};