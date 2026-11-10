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

      await ctx.deleteMessage().catch(() => {});
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
      // Check if current message has photo, if yes use editMessageCaption, else editMessageText
      if (ctx.callbackQuery.message.photo) {
        await ctx.editMessageCaption(text, {
          parse_mode: 'Markdown',
          ...getNumPadKeyboard()
        });
      } else {
        await ctx.editMessageText(text, {
          parse_mode: 'Markdown',
          ...getNumPadKeyboard()
        });
      }
    } catch (err) {
      // Ignore if message is not modified
    }
  });