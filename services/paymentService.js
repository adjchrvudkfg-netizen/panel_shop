function generateUpiQrUrl(amount, upiId = '9694421148@fam', payeeName = 'Aditya') {
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&margin=2`;
    
    return {
        upiString,
        qrImageUrl
    };
}

module.exports = { generateUpiQrUrl };