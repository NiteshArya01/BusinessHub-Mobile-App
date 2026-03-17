import { Alert } from 'react-native';

export const uploadFileToCloudinary = async (file) => {
  // 1. Validation Logic
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  
  if (!allowedTypes.includes(file.type)) {
    Alert.alert(
      "Unsupported File Format",
      "Please upload a valid document. Supported formats: JPG, PNG, and PDF."
    );
    return null;
  }

  // 2. Prepare FormData
  const data = new FormData();
  data.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.name || (file.type === 'application/pdf' ? 'document.pdf' : 'image.jpg'),
  });
  
  // YAHAN APNA UNSIGNED PRESET NAME DALO (Ye dashboard se milega)
  data.append('upload_preset', 'purchase_ledger'); 
  data.append('cloud_name', 'du9o81yb9');
  data.append('resource_type', 'auto');

  try {
    // '/auto/upload' endpoint PDF aur Image dono ko handle kar leta hai
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/du9o81yb9/auto/upload`, 
      {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    const result = await response.json();

    if (result.secure_url) {
      // SUCCESS: Aapko URL mil gaya
      return result.secure_url; 
    } else {
      console.log("Cloudinary Error Result:", result);
      throw new Error(result.error?.message || "Upload failed");
    }
  } catch (error) {
    console.error("Cloudinary Error:", error);
    Alert.alert("Error", "File upload failed. Check your internet or Preset name.");
    return null;
  }
};