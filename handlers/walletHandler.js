const { Markup } = require('telegraf');
const { getNumPadKeyboard } = require('../utils/keyboards');

const UPI_ID = '9694421148@fam';
const userAmountInput = {};
const pendingPayments = {};

function setupWalletHandler(bot, users, ADMIN_ID) {
  bot.action('add_balance', (ctx) => {
    ctx.answerCbQuery();
    const userId = ctx.from.id;
    userAmountInput[userId] = '';

    const text = `🏛 **Custom Amount**\n` +
                 `_____________________\n` +
                 `Method: 💚 FamPay UPI\n(${UPI_ID})\n` +
                 `Min: ₹1 | Max: ₹5,000\n` +
                 `_____________________\n\n` +
                 `Apna amount enter karo aur payment complete karke balance add karwao.\n\n` +
                 `🔻 Amount: ₹0\n` +
                 `🔻 Amount type karo - buttons se:`;

    return ctx.editMessageText(text, getNumPadKeyboard());
  });

  bot.action(/num_(\d|del|confirm)/, async (ctx) => {
    const action = ctx.match[1];
    const userId = ctx.from.id;
    let currentVal = userAmountInput[userId] || '';

    if (action === 'del') {
      currentVal = currentVal.slice(0, -1);
    } else if (action === 'confirm') {
      const amount = parseInt(currentVal, 10);
      if (!amount || amount < 1) {
        return ctx.answerCbQuery('⚠️ Kripya kam se kam ₹1 ya usse zyada amount enter karein.', { show_alert: true });
      }

      ctx.answerCbQuery();
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=AdityaShop&am=${amount}&cu=INR`;
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

      const paymentId = `PAY_${Date.now()}`;
      pendingPayments[paymentId] = { userId, amount, status: 'PENDING' };

      const caption = `🏛 **FAMCORP PAYMENT GATEWAY**\n` +
                      `_____________________\n\n` +
                      `👤 **UPI ID:** \`${UPI_ID}\`\n` +
                      `💰 **Amount:** ₹${amount}\n` +
                      `_____________________\n\n` +
                      `1. Kisi bhi UPI App (PhonePe, GPay, FamPay) se upar diye gaye QR ko scan karein.\n` +
                      `2. Payment hone ke baad neeche "✅ Payment Done" button dabayein.`;

      await ctx.deleteMessage();
      return ctx.replyWithPhoto(qrImageUrl, {
        caption: caption,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('✅ Payment Done', `paydone_${paymentId}`)],
          [Markup.button.callback('⬅️ Back', 'add_balance')]
        ])
      });
    } else {
      if (currentVal.length < 5) {
        currentVal += action;
      }
    }

    userAmountInput[userId] = currentVal;
    const displayAmount = currentVal === '' ? '0' : currentVal;

    const text = `🏛 **Custom Amount**\n` +
                 `_____________________\n` +
                 `Method: 💚 FamPay UPI\n(${UPI_ID})\n` +
                 `Min: ₹1 | Max: ₹5,000\n` +
                 `_____________________\n\n` +
                 `Apna amount enter karo aur payment complete karke balance add karwao.\n\n` +
                 `🔻 Amount: ₹${displayAmount}\n` +
                 `🔻 Amount type karo - buttons se:`;

    try {
      await ctx.editMessageText(text, getNumPadKeyboard());
    } catch (err) {}
  });

  bot.action(/paydone_(.+)/, async (ctx) => {
    ctx.answerCbQuery();
    const paymentId = ctx.match[1];
    const payment = pendingPayments[paymentId];

    if (!payment) return ctx.reply('⚠️ Payment session expired.');

    await ctx.reply('⏳ **Aapka payment request admin ko bhej diya gaya hai. Verification ke baad balance add ho jayega!**');

    const adminText = `🔔 **NEW PAYMENT APPROVAL REQUEST**\n\n` +
                      `👤 **User ID:** \`${payment.userId}\`\n` +
                      `👤 **Name:** ${ctx.from.first_name}\n` +
                      `💰 **Amount:** ₹${payment.amount}\n` +
                      `🆔 **Txn Ref:** \`${paymentId}\``;

    return bot.telegram.sendMessage(ADMIN_ID, adminText, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('✅ Approve', `approve_${paymentId}`), Markup.button.callback('❌ Reject', `reject_${paymentId}`)]
      ])
    });
  });

  bot.action(/approve_(.+)/, async (ctx) => {
    ctx.answerCbQuery('Approved!');
    const paymentId = ctx.match[1];
    const payment = pendingPayments[paymentId];

    if (payment && payment.status === 'PENDING') {
      payment.status = 'APPROVED';
      if (!users[payment.userId]) users[payment.userId] = { balance: 0, orders: [] };
      users[payment.userId].balance += payment.amount;

      await ctx.editMessageText(`${ctx.callbackQuery.message.text}\n\n✅ **STATUS: APPROVED by Admin**`);
      return bot.telegram.sendMessage(payment.userId, `🎉 **Payment Successful!**\n\n₹${payment.amount} aapke wallet me add kar diya gaya h.\n💰 Naya Balance: ₹${users[payment.userId].balance}`);
    }
  });

  bot.action(/reject_(.+)/, async (ctx) => {
    ctx.answerCbQuery('Rejected!');
    const paymentId = ctx.match[1];
    const payment, payment = pendingPayments[paymentId];

    if (payment && payment.status === 'PENDING') {
      payment.status = 'REJECTED';
      await ctx.editMessageText(`${ctx.callbackQuery.message.text}\n\n❌ **STATUS: REJECTED by Admin**`);
      return bot.telegram.sendMessage(payment.userId, `❌ Aapka ₹${payment.amount} ka payment verify nahi ho paya.`);
    }
  });
}

module.exports = { setupWalletHandler };