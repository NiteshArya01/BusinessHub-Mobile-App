
import { db,auth } from '../api/firebase'; // Aapki firebase file
import { collection,query,addDoc, serverTimestamp, doc, updateDoc, increment,where,orderBy,getDocs,limit,startAfter } from 'firebase/firestore';

import ItemModel from '../models/ItemModel';

export const ItemController = (initialItems = []) => {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);

  // --- SAVE OR UPDATE LOGIC ---
  const handleSaveItem = async (formData) => {
    setLoading(true);
    
    // Server/DB simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const processedItem = createItemObject(formData);

        setItems((currentItems) => {
          const index = currentItems.findIndex(i => i.id === processedItem.id);
          
          if (index > -1) {
            // Agar pehle se hai toh Update
            const updatedList = [...currentItems];
            updatedList[index] = processedItem;
            return updatedList;
          } else {
            // Nahi hai toh naya Add (Sabse upar)
            return [processedItem, ...currentItems];
          }
        });

        setLoading(false);
        resolve({ success: true, message: "Inventory updated" });
      }, 1000); // 1 second ka artificial delay for spinner
    });
  };

  // --- DELETE LOGIC ---
  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  // --- SEARCH LOGIC ---
  const getFilteredItems = (query) => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.category.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    items,
    loading,
    handleSaveItem,
    handleDeleteItem,
    getFilteredItems
  };
};