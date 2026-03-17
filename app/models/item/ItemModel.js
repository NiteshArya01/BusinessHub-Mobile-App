export const ItemModel = {
  id: "",
  name: "",
  category: "General",
  hsn: "",
  gstRate: 0,
  isGstIncluded: false,
  quantity: 0,
  purchaseRate: 0,
  wholesalePrice: 0,
  retailPrice: 0,
  remarks: "",
  entryType: "StockItem", // Jaise aapne Voucher mein rakha hai
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};