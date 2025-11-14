import * as Clipboard from "expo-clipboard";
import { Check, Copy, Plus, Save, Trash2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import ProfileHeader from "../../components/layout/ProfileHeader";
import {
  getCompanyData,
  resetCompany,
  setCompanyData,
  updateCompanyData,
} from "../../redux/slices/CompanySlice";
import { setUpdatedPage } from "../../redux/slices/UpdatePageSlice";
import { getUserImages } from "../../redux/slices/UserImagesSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { updatePageChecker } from "../../utils/helpers";

const CURRENT_PAGE = "/(tabs)/company";

export default function CompanyScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSelector((state: RootState) => state.company);
  const { updatedPage } = useSelector((state: RootState) => state.updatePage);
  const { user } = useSelector((state: RootState) => state.user);
  const [copied, setCopied] = useState<string | null>(null);

  const cardId = user?.cardId;
  const isUpdated = updatePageChecker(CURRENT_PAGE, updatedPage);

  useEffect(() => {
    if (cardId) {
      dispatch(getCompanyData({ cardId }));
      dispatch(getUserImages({ cardId }));
    }
  }, [cardId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCompany());
    };
  }, [dispatch]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
      Toast.show({
        type: "success",
        text1: "Kopyalandı",
        visibilityTime: 1500,
      });
    } catch (err) {
      console.error("Kopyalama hatası:", err);
    }
  };

  // Company Info Functions
  const handleCompanyInfoChange = (
    idx: number,
    field: string,
    value: string
  ) => {
    if (!data?.companyInfos) return;

    const updated = data.companyInfos.map((item: any, i: number) =>
      i === idx ? { ...item, [field]: value } : item
    );

    dispatch(setCompanyData({ ...data, companyInfos: updated }));
  };

  const handleAddCompanyInfo = () => {
    const newItem = {
      name: "",
      taxNo: "",
      taxBody: "",
      address: "",
    };

    dispatch(
      setCompanyData({
        ...data,
        companyInfos: [...(data?.companyInfos || []), newItem],
      })
    );
  };

  const handleDeleteCompanyInfo = (index: number) => {
    if (!data?.companyInfos) return;

    const updated = data.companyInfos.filter(
      (_: any, i: number) => i !== index
    );

    dispatch(setCompanyData({ ...data, companyInfos: updated }));
  };

  // Bank Info Functions
  const handleBankInfoChange = (idx: number, field: string, value: string) => {
    if (!data?.bankAccounts) return;

    const updated = data.bankAccounts.map((item: any, i: number) =>
      i === idx ? { ...item, [field]: value } : item
    );

    dispatch(setCompanyData({ ...data, bankAccounts: updated }));
  };

  const handleAddBankInfo = () => {
    const newItem = {
      iban: "",
      holderName: "",
      bankName: "",
    };

    dispatch(
      setCompanyData({
        ...data,
        bankAccounts: [...(data?.bankAccounts || []), newItem],
      })
    );
  };

  const handleDeleteBankInfo = (index: number) => {
    const updated = [...data.bankAccounts];
    updated.splice(index, 1);
    dispatch(setCompanyData({ ...data, bankAccounts: updated }));
  };

  const handleSave = async () => {
    const res = await dispatch(
      updateCompanyData({ cardId, updatedData: data })
    );
    if (res?.meta?.requestStatus === "fulfilled") {
      dispatch(getCompanyData({ cardId }));
      dispatch(setUpdatedPage(null));
      Toast.show({
        type: "success",
        text1: "Kaydedildi",
      });
    }
  };

  const handleCancel = () => {
    dispatch(getCompanyData({ cardId }));
    dispatch(setUpdatedPage(null));
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7196AC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader currentPage={CURRENT_PAGE} />

        <View style={styles.content}>
          {/* Company Infos */}
          <Text style={styles.sectionTitle}>Şirket Bilgileri</Text>

          {isUpdated && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddCompanyInfo}
            >
              <Plus size={20} color="#7196AC" />
              <Text style={styles.addButtonText}>Şirket Ekle</Text>
            </TouchableOpacity>
          )}

          {data?.companyInfos?.length > 0 ? (
            data.companyInfos.map((item: any, idx: number) => (
              <View key={idx} style={styles.card}>
                {isUpdated ? (
                  <>
                    <View style={styles.editGroup}>
                      <Text style={styles.label}>Şirket Adı</Text>
                      <TextInput
                        style={styles.input}
                        value={item?.name || ""}
                        onChangeText={(text) =>
                          handleCompanyInfoChange(idx, "name", text)
                        }
                        placeholder="Şirket adı"
                        placeholderTextColor="#666"
                      />
                    </View>

                    <View style={styles.editGroup}>
                      <Text style={styles.label}>Vergi Numarası</Text>
                      <TextInput
                        style={styles.input}
                        value={item?.taxNo || ""}
                        onChangeText={(text) =>
                          handleCompanyInfoChange(idx, "taxNo", text)
                        }
                        placeholder="Vergi numarası"
                        placeholderTextColor="#666"
                      />
                    </View>

                    <View style={styles.editGroup}>
                      <Text style={styles.label}>Vergi Dairesi</Text>
                      <TextInput
                        style={styles.input}
                        value={item?.taxBody || ""}
                        onChangeText={(text) =>
                          handleCompanyInfoChange(idx, "taxBody", text)
                        }
                        placeholder="Vergi dairesi"
                        placeholderTextColor="#666"
                      />
                    </View>

                    <View style={styles.editGroup}>
                      <Text style={styles.label}>Adres</Text>
                      <TextInput
                        style={styles.input}
                        value={item?.address || ""}
                        onChangeText={(text) =>
                          handleCompanyInfoChange(idx, "address", text)
                        }
                        placeholder="Adres"
                        placeholderTextColor="#666"
                        multiline
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteCompanyInfo(idx)}
                    >
                      <Trash2 size={20} color="#ff6b6b" />
                      <Text style={styles.deleteButtonText}>Sil</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.infoRow}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.label}>Şirket Adı</Text>
                        <Text style={styles.value}>{item?.name}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() =>
                          handleCopy(item?.name, `company-name-${idx}`)
                        }
                      >
                        {copied === `company-name-${idx}` ? (
                          <Check size={18} color="#70C094" />
                        ) : (
                          <Copy size={18} color="#8E8E8E" />
                        )}
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.label}>Vergi Numarası</Text>
                        <Text style={styles.value}>{item?.taxNo}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() => handleCopy(item?.taxNo, `tax-no-${idx}`)}
                      >
                        {copied === `tax-no-${idx}` ? (
                          <Check size={18} color="#70C094" />
                        ) : (
                          <Copy size={18} color="#8E8E8E" />
                        )}
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.label}>Vergi Dairesi</Text>
                        <Text style={styles.value}>{item?.taxBody}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() =>
                          handleCopy(item?.taxBody, `tax-body-${idx}`)
                        }
                      >
                        {copied === `tax-body-${idx}` ? (
                          <Check size={18} color="#70C094" />
                        ) : (
                          <Copy size={18} color="#8E8E8E" />
                        )}
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.label}>Adres</Text>
                        <Text style={styles.value}>{item?.address}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() =>
                          handleCopy(item?.address, `address-${idx}`)
                        }
                      >
                        {copied === `address-${idx}` ? (
                          <Check size={18} color="#70C094" />
                        ) : (
                          <Copy size={18} color="#8E8E8E" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Şirket bilgisi bulunamadı</Text>
          )}

          {/* Bank Accounts */}
          <Text style={styles.sectionTitle}>Banka Bilgileri</Text>

          {isUpdated && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddBankInfo}
            >
              <Plus size={20} color="#7196AC" />
              <Text style={styles.addButtonText}>Banka Hesabı Ekle</Text>
            </TouchableOpacity>
          )}

          {data?.bankAccounts && data.bankAccounts.length > 0 ? (
            data.bankAccounts.map((item: any, idx: number) => (
              <View key={idx} style={styles.card}>
                {isUpdated ? (
                  <>
                    <View style={styles.editGroup}>
                      <Text style={styles.label}>Banka Adı</Text>
                      <TextInput
                        style={styles.input}
                        value={item?.bankName || ""}
                        onChangeText={(text) =>
                          handleBankInfoChange(idx, "bankName", text)
                        }
                        placeholder="Banka adı"
                        placeholderTextColor="#666"
                      />
                    </View>

                    <View style={styles.editGroup}>
                      <Text style={styles.label}>IBAN</Text>
                      <TextInput
                        style={styles.input}
                        value={item?.iban || ""}
                        onChangeText={(text) =>
                          handleBankInfoChange(idx, "iban", text)
                        }
                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                        placeholderTextColor="#666"
                      />
                    </View>

                    <View style={styles.editGroup}>
                      <Text style={styles.label}>Hesap Sahibi</Text>
                      <TextInput
                        style={styles.input}
                        value={item?.holderName || ""}
                        onChangeText={(text) =>
                          handleBankInfoChange(idx, "holderName", text)
                        }
                        placeholder="Hesap sahibi"
                        placeholderTextColor="#666"
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteBankInfo(idx)}
                    >
                      <Trash2 size={20} color="#ff6b6b" />
                      <Text style={styles.deleteButtonText}>Sil</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.infoRow}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.label}>Banka Adı</Text>
                        <Text style={styles.value}>{item?.bankName}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() =>
                          handleCopy(item?.bankName, `bank-name-${idx}`)
                        }
                      >
                        {copied === `bank-name-${idx}` ? (
                          <Check size={18} color="#70C094" />
                        ) : (
                          <Copy size={18} color="#8E8E8E" />
                        )}
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.label}>IBAN</Text>
                        <Text style={styles.value}>{item?.iban}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() => handleCopy(item?.iban, `iban-${idx}`)}
                      >
                        {copied === `iban-${idx}` ? (
                          <Check size={18} color="#70C094" />
                        ) : (
                          <Copy size={18} color="#8E8E8E" />
                        )}
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.label}>Hesap Sahibi</Text>
                        <Text style={styles.value}>{item?.holderName}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() =>
                          handleCopy(item?.holderName, `holder-${idx}`)
                        }
                      >
                        {copied === `holder-${idx}` ? (
                          <Check size={18} color="#70C094" />
                        ) : (
                          <Copy size={18} color="#8E8E8E" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Banka bilgisi bulunamadı</Text>
          )}

          {/* Save/Cancel Buttons */}
          {isUpdated && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Save size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <X size={20} color="#fff" />
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141e22",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
    marginTop: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10181B",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7196AC",
  },
  card: {
    backgroundColor: "#1B272C",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  editGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    color: "#8E8E8E",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#273034",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 15,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#3B1F2B",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff6b6b",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#273034",
  },
  infoLeft: {
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    marginTop: 4,
  },
  copyBtn: {
    padding: 8,
  },
  noDataText: {
    fontSize: 15,
    color: "#8E8E8E",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#70C094",
    paddingVertical: 15,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ff6b6b",
    paddingVertical: 15,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
