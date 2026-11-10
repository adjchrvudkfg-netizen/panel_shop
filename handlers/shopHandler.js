const { Markup } = require('telegraf');

const UPI_ID = '9694421148@fam';
const pendingProductPayments = {}; // { paymentId: { userId, product, plan, amount } }

// Product keys pool
const productKeys = {
  'Phantom Panel': ['PHANTOM-1DAY-XYZ99', 'PHANTOM-3DAY-ABC88', 'PHANTOM-7DAY-LMN77'],
  'Drip Client': ['DRIP-1DAY-DRP11', 'DRIP-3DAY-DRP22', 'DRIP-7DAY-DRP33'],
  'Drake': [
    'DRAKE-1H-KEY01', 'DRAKE-2H-KEY02', 'DRAKE-3H-KEY03', 
    'DRAKE-6H-KEY04', 'DRAKE-12H-KEY05', 'DRAKE-1D-KEY06'
  ]
};

function setupShopHandler(bot, users, ADMIN_ID) {
  // 1. Open Shop Menu
  bot.action('shop', (ctx) => {
    ctx.answerCbQuery();
    const text = `🛍️ **- ADITYA PANEL SHOP -** 🛍️\n\nPlease select a product below:`;
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('💀 Phantom Panel', 'product_phantom')],
        [Markup.button.callback('💧 Drip Client', 'product_drip')],
        [Markup.button.callback('⚡ Drake', 'product_drake')],
        [Markup.button.callback('⬅️ Back to Main Menu', 'main_menu')]
      ])
    });
  });

  // 2. Phantom Panel Pricing Menu
  bot.action('product_phantom', (ctx) => {
    ctx.answerCbQuery();
    const text = `💀 **PHANTOM PANEL - PRICING** 💀`;
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('1 Day - ₹95', 'buy_Phantom Panel_1 Day_95')],
        [Markup.button.callback('3 Days - ₹145', 'buy_Phantom Panel_3 Days_145')],
        [Markup.button.callback('7 Days - ₹320', 'buy_Phantom Panel_7 Days_320')],
        [Markup.button.callback('⬅️ Back to Shop', 'shop')]
      ])
    });
  });

  // 3. Drip Client Pricing Menu
  bot.action('product_drip', (ctx) => {
    ctx.answerCbQuery();
    const text = `💧 **DRIP CLIENT - PRICING** 💧`;
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('1 Day - ₹90', 'buy_Drip Client_1 Day_90')],
        [Markup.button.callback('3 Days - ₹140', 'buy_Drip Client_3 Days_140')],
        [Markup.button.callback('7 Days - ₹300', 'buy_Drip Client_7 Days_300')],
        [Markup.button.callback('⬅️ Back to Shop', 'shop')]
      ])
    });
  });

  // 4. Drake Pricing Menu (New Added)
  bot.action('product_drake', (ctx) => {
    ctx.answerCbQuery();
    const text = `⚡ **DRAKE - PRICING** ⚡`;
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('1 Hour - ₹9', 'buy_Drake_1 Hour_9')],
        [Markup.button.callback('2 Hours - ₹23', 'buy_Drake_2 Hours_23')],
        [Markup.button.callback('3 Hours - ₹35', 'buy_Drake_3 Hours_35')],
        [Markup.button.callback('6 Hours - ₹66', 'buy_Drake_6 Hours_66')],
        [Markup.button.callback('12 Hours - ₹80', 'buy_Drake_12 Hours_80')],
        [Markup.button.callback('1 Day - ₹92', 'buy_Drake_1 Day_92')],
        [Markup.button.callback('⬅️ Back to Shop', 'shop')]
      ])
    });
  });

  // 5. Price Click -> Generate QR Code for Payment
  bot.action(/^buy_(.+)_(.+)_(.+)$/, async (ctx) => {
    const product = ctx.match[1];
    const plan = ctx.match[2];
    const amount = parseInt(ctx.match[3], 10);
    const userId = ctx.from.id;

    ctx.answerCbQuery();
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=AdityaShop&am=${amount}&cu=INR`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

    const paymentId = `PROD_${Date.now()}`;
    pendingProductPayments[paymentId] = { userId, product, plan, amount, status: 'PENDING' };

    const caption = `🏛 **FAMCORP PAYMENT GATEWAY**\n` +
                    `_____________________\n\n` +
                    `📦 **Product:** ${product} (${plan})\n` +
                    `👤 **UPI ID:** \`${UPI_ID}\`\n` +
                    `💰 **Amount:** ₹${amount}\n` +
                    `_____________________\n\n` +
                    `1. Upar diye gaye QR ko FamPay / PhonePe / GPay se scan karke payment karein.\n` +
                    `2. Payment hone ke baad neeche **"✅ Payment Done"** button dabayein.`;

    await ctx.deleteMessage().catch(() => {});
    return ctx.replyWithPhoto(qrImageUrl, {
      caption: caption,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('✅ Payment Done', `prodpay_${paymentId}`)],
        [Markup.button.callback('⬅️ Back to Shop', 'shop')]
      ])
    });
  });

  // 6. Payment Done -> Send Approval to Admin
  bot.action(/prodpay_(.+)/, async (ctx) => {
    ctx.answerCbQuery();
    const paymentId = ctx.match[1];
    const payment = pendingProductPayments[paymentId];

    if (!payment) return ctx.reply('⚠️ Payment session expired.');

    await ctx.reply('⏳ **Aapka payment verification ke liye Admin ke paas bhej diya gaya hai. Aprobation milte hi key mil jayegi!**');

    const adminText = `🔔 **NEW PRODUCT PAYMENT APPROVAL**\n\n` +
                      `👤 **User ID:** \`${payment.userId}\`\n` +
                      `👤 **Name:** ${ctx.from.first_name}\n` +
                      `📦 **Product:** ${payment.product} (${payment.plan})\n` +
                      `💰 **Amount:** ₹${payment.amount}\n` +
                      `🆔 **Ref ID:** \`${paymentId}\``;

    return bot.telegram.sendMessage(ADMIN_ID, adminText, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('✅ Approve & Send Key', `prodapp_${paymentId}`)],
        [Markup.button.callback('❌ Reject', `prodrej_${paymentId}`)]
      ])
    });
  });

  // 7. Admin Approve -> Send Key to User & Save Order
  bot.action(/prodapp_(.+)/, async (ctx) => {
    ctx.answerCbQuery('Approved & Key Sent!');
    const paymentId = ctx.match[1];
    const payment = pendingProductPayments[paymentId];

    if (payment && payment.status === 'PENDING') {
      payment.status = 'APPROVED';

      const keysList = productKeys[payment.product] || ['DEFAULT-KEY-12345'];
      const assignedKey = keysList[Math.floor(Math.random() * keysList.length)];

      if (!users[payment.userId]) users[payment.userId] = { balance: 0, orders: [] };
      users[payment.userId].orders.push({
        product: payment.product,
        plan: payment.plan,
        key: assignedKey,
        date: new Date().toLocaleDateString()
      });

      await ctx.editMessageText(`${ctx.callbackQuery.message.text}\n\n✅ **STATUS: APPROVED & Key Delivered**`);

      return bot.telegram.sendMessage(
        payment.userId,
        `🎉 **Payment Verified & Approved!**\n\nAapka order successfully deliver ho gaya hai:\n\n` +
        `📦 **Product:** ${payment.product} (${payment.plan})\n` +
        `🔑 **License Key:** \`${assignedKey}\`\n\nAap ise 'My Orders' me bhi dekh sakte hain!`,
        { parse_mode: 'Markdown' }
      );
    }
  });

  // 8. Admin Reject
  bot.action(/prodrej_(.+)/, async (ctx) => {
    ctx.answerCbQuery('Rejected!');
    const paymentId = ctx.match[1];
    const payment = pendingProductPayments[paymentId];

    if (payment && payment.status === 'PENDING') {
      payment.status = 'REJECTED';
      await ctx.editMessageText(`${ctx.callbackQuery.message.text}\n\n❌ **STATUS: REJECTED by Admin**`);
      return bot.telegram.sendMessage(payment.userId, `❌ Aapka ${payment.product} ka payment verify nahi ho paya.`);
    }
  });

  // My Orders Handler
  bot.action('my_orders', (ctx) => {
    ctx.answerCbQuery();
    const userId = ctx.from.id;
    const user = users[userId] || { balance: 0, orders: [] };

    if (user.orders.length === 0) {
      return ctx.editMessageText('📦 **My Orders**\n\nAapne abhi tak koi order nahi kiya h.', {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back to Main Menu', 'main_menu')]])
      });
    }

    let text = `📦 **YOUR ORDERS HISTORY**\n\n`;
    user.orders.forEach((order, index) => {
      text += `${index + 1}. **${order.product}** (${order.plan})\n🔑 Key: \`${order.key}\`\n📅 Date: ${order.date}\n\n`;
    });

    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back to Main Menu', 'main_menu')]])
    });
  });
}

module.exports = { setupShopHandler };