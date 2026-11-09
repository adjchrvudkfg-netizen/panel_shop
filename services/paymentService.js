// Payment Service - FamPay UPI Integration
function generateUpiQrUrl(amount, upiId = '9694421148@fam', payeeName = 'Aditya') {
    // Standard UPI string format jo kisi bhi app (PhonePe, GPay, FamPay) se scan ho jata hai
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    
    // Quickchart API ka use karke instant QR code image ka URL generate kar rahe hain
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&margin=2`;
    
    return {
        upiString,
        qrImageUrl
    };
}

module.exports = { generateUpiQrUrl };