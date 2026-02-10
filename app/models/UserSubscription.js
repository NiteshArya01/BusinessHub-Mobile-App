export const createUserSubscription = (uid, planId, planName, durationInDays, storageLimitMB, invoiceLimit) => {
  const startDate = new Date();
  const expiryDate = new Date();
  
  // Expiry date logic
  expiryDate.setDate(startDate.getDate() + durationInDays);

  return {
    // --- Basic Mapping ---
    uid,                  // User se link karne ke liye
    planId,               // e.g., 'gold_monthly', 'basic_yearly'
    planName,             // Display name: 'Premium Plan'
    
    // --- Validity & Dates ---
    startDate: startDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    status: 'active',     // active, expired, trialing, ya cancelled
    
    // --- Payment Info ---
    paymentStatus: 'paid', // paid, pending, ya failed
    lastPaymentId: '',    // Transaction reference (Razorpay/Stripe ID)
    autoRenew: true,      // Future automatic billing ke liye
    
    // --- Usage Limits (Feature Control) ---
    invoiceLimit: invoiceLimit,  // Total kitne invoice bana sakta hai (e.g., 500)
    invoicesCreated: 0,          // Abhi tak kitne banaye
    
    // --- Disk Space Management (Storage) ---
    storageLimitMB: storageLimitMB, // Total space (e.g., 1024 for 1GB)
    storageUsedMB: 0,               // Kitna space use ho gaya
    
    // --- Metadata ---
    lastUpdated: new Date().toISOString()
  };
};