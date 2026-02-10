export const createUserProfile = (uid, businessName, email) => {
  return {
    uid,
    businessName,
    email,
    createdAt: new Date().toISOString(),
    role: 'Admin',
    active: true, // Company ko block/unblock karne ke liye
  };
};