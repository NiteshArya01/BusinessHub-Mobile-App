export const createSupplierModel = (uid, formData, balanceType) => {
  return {
    createdBy: uid, // Login user ki unique ID
    isActive: true, 
    name: formData.name,
    phone: formData.phone,
    gstin: formData.gstin || '',
    address: formData.address || '',
    // Opening balance logic
    openingBalance: parseFloat(formData.amount) || 0,
    balanceType: balanceType, // 'Cr' (Dena hai) ya 'Dr' (Paisa jama hai)
    // Bank Details
    bankDetails: {
      accNo: formData.accNo || '',
      bankName: formData.bankName || '',
      ifsc: formData.ifsc || ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};