export const SupplierPaymentModel = {
  supplierId: "",        // Supplier ki Unique ID
  type: "Payment Out",   // Transaction Pehchan
  amount: 0,             // Paid Amount
  date: "",               // Display Date (en-GB)
  paymentMode: "",       // Cash/UPI/Bank
  remarks: "",           // Notes
  attachmentUrl: null,   // PDF/Image link
  createdAt: new Date().toISOString(), // Accurate sorting ke liye
};