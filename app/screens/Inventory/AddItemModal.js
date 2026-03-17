import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Switch,
  ActivityIndicator,
} from "react-native";

export default function AddItemModal({
  visible,
  onClose,
  onSubmit,
  editData = null, // if edit
}) {
  const [form, setForm] = useState({
    category: "",
    brand: "",
    name: "",
    size: "",
    color: "",
    gstRate: "",
    hsn: "",
    quantity: "",
    purchaseRate: "",
    wholesalePrice: "",
    retailPrice: "",
    remark: "",
  });

  const [isGstIncluded, setIsGstIncluded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm(editData);
      setIsGstIncluded(editData.isGstIncluded || false);
    }
  }, [editData]);

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Product name required";
    if (!form.category.trim()) newErrors.category = "Category required";
    if (!form.quantity || isNaN(form.quantity))
      newErrors.quantity = "Valid quantity required";
    if (!form.purchaseRate)
      newErrors.purchaseRate = "Purchase rate required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      id: editData ? editData.id : Date.now().toString(),
      ...form,
      quantity: Number(form.quantity),
      gstRate: Number(form.gstRate || 0),
      purchaseRate: Number(form.purchaseRate),
      wholesalePrice: Number(form.wholesalePrice || 0),
      retailPrice: Number(form.retailPrice || 0),
      isGstIncluded,
      updatedAt: new Date(),
    };

    await onSubmit(payload);

    setLoading(false);
    onClose();
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContent}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>
              {editData ? "Update Product" : "Add New Product"}
            </Text>

            {/* CATEGORY */}
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={form.category}
              onChangeText={(v) => handleChange("category", v)}
            />
            {errors.category && <Text style={styles.error}>{errors.category}</Text>}

            {/* PRODUCT NAME */}
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            {/* QUANTITY */}
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={form.quantity}
              onChangeText={(v) => handleChange("quantity", v)}
            />
            {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}

            {/* PURCHASE RATE */}
            <TextInput
              style={styles.input}
              placeholder="Purchase Rate"
              keyboardType="numeric"
              value={form.purchaseRate}
              onChangeText={(v) => handleChange("purchaseRate", v)}
            />
            {errors.purchaseRate && (
              <Text style={styles.error}>{errors.purchaseRate}</Text>
            )}

            {/* GST */}
            <View style={styles.gstRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="GST %"
                keyboardType="numeric"
                value={form.gstRate}
                onChangeText={(v) => handleChange("gstRate", v)}
              />
              <Switch
                value={isGstIncluded}
                onValueChange={setIsGstIncluded}
              />
            </View>

            {/* SUBMIT BUTTON */}
            {loading ? (
              <ActivityIndicator size="large" color="#0077cc" />
            ) : (
              <TouchableOpacity style={styles.btnSave} onPress={handleSubmit}>
                <Text style={styles.btnText}>
                  {editData ? "Update Product" : "Save Product"}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "white", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, height: "85%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#0077cc", marginBottom: 15 },
  input: { backgroundColor: "#F8F9FB", padding: 12, borderRadius: 12, marginTop: 12 },
  btnSave: { backgroundColor: "#0077cc", padding: 16, borderRadius: 15, alignItems: "center", marginTop: 25 },
  btnText: { fontWeight: "bold", color: "#FFF", fontSize: 16 },
  error: { color: "red", fontSize: 12 },
  gstRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
});
