// SimpleVoucherModel.js
export const SimpleVoucherModel = {
  billNo: "",
  date: "",
  amount: 0,
  remarks: "",
  attachment: null, // Stores file URI or base64
  supplierId: null,
  entryType: "Voucher", // To distinguish from Itemized Bills
  createdAt: new Date().toISOString(),
};