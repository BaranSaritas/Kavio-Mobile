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

  // SAFE DATA
  const safeData = data ?? {};
  const companyInfos = safeData.companyInfos ?? [];
  const bankAccounts = safeData.bankAccounts ?? [];

  useEffect(() => {
    if (cardId) {
      dispatch(getCompanyData({ cardId }));
      dispatch(getUserImages({ cardId }));
    }
  }, [cardId, dispatch]);

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

  // --------------------------------------------------
  // COMPANY INFO HANDLERS (SAFE)
  // --------------------------------------------------
  const handleCompanyInfoChange = (
    idx: number,
    field: string,
    value: string
  ) => {
    const updated = companyInfos.map((item: any, i: number) =>
      i === idx ? { ...item, [field]: value } : item
    );

    dispatch(
      setCompanyData({
        ...safeData,
        companyInfos: updated,
      })
    );
  };

  const handleAddCompanyInfo = () => {
    dispatch(
      setCompanyData({
        ...safeData,
        companyInfos: [
          ...companyInfos,
          { name: "", taxNo: "", taxBody: "", address: "" },
        ],
      })
    );
  };

  const handleDeleteCompanyInfo = (index: number) => {
    const updated = [...companyInfos];
    updated.splice(index, 1);

    dispatch(
      setCompanyData({
        ...safeData,
        companyInfos: updated,
      })
    );
  };

  // --------------------------------------------------
  // BANK ACCOUNT HANDLERS (SAFE)
  // --------------------------------------------------
  const handleBankInfoChange = (idx: number, field: string, value: string) => {
    const updated = bankAccounts.map((item: any, i: number) =>
      i === idx ? { ...item, [field]: value } : item
    );

    dispatch(
      setCompanyData({
        ...safeData,
        bankAccounts: updated,
      })
    );
  };

  const handleAddBankInfo = () => {
    dispatch(
      setCompanyData({
        ...safeData,
        bankAccounts: [
          ...bankAccounts,
          { iban: "", holderName: "", bankName: "" },
        ],
      })
    );
  };

  const handleDeleteBankInfo = (index: number) => {
    const updated = [...bankAccounts];
    updated.splice(index, 1);

    dispatch(
      setCompanyData({
        ...safeData,
        bankAccounts: updated,
      })
    );
  };

  const handleSave = async () => {
    const res = await dispatch(
      updateCompanyData({ cardId, updatedData: safeData })
    );
    if (res?.meta?.requestStatus === "fulfilled") {
      dispatch(getCompanyData({ cardId }));
      dispatch(setUpdatedPage(null));
      Toast.show({ type: "success", text1: "Kaydedildi" });
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
              style={styles.addButtonFull}
              onPress={handleAddCompanyInfo}
            >
              <Text style={styles.addButtonText}>Şirket Ekle</Text>
              <Plus size={16} color="#7196AC" />
            </TouchableOpacity>
          )}

          {companyInfos.length > 0
            ? companyInfos.map((item: any, idx: number) => (
                <View key={idx} style={styles.card}>
                  {isUpdated ? (
                    <>
                      <TextInput
                        style={styles.input}
                        value={item?.name}
                        onChangeText={(v) =>
                          handleCompanyInfoChange(idx, "name", v)
                        }
                        placeholder="Şirket Adı"
                        placeholderTextColor="#666"
                      />
                      <TextInput
                        style={styles.input}
                        value={item?.taxNo}
                        onChangeText={(v) =>
                          handleCompanyInfoChange(idx, "taxNo", v)
                        }
                        placeholder="Vergi No"
                        placeholderTextColor="#666"
                      />
                      <TextInput
                        style={styles.input}
                        value={item?.taxBody}
                        onChangeText={(v) =>
                          handleCompanyInfoChange(idx, "taxBody", v)
                        }
                        placeholder="Vergi Dairesi"
                        placeholderTextColor="#666"
                      />
                      <TextInput
                        style={styles.input}
                        value={item?.address}
                        onChangeText={(v) =>
                          handleCompanyInfoChange(idx, "address", v)
                        }
                        placeholder="Adres"
                        placeholderTextColor="#666"
                        multiline
                      />
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteCompanyInfo(idx)}
                      >
                        <Trash2 size={20} color="#ff6b6b" />
                        <Text style={styles.deleteBtnText}>Sil</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      {/* STATIC VIEW */}
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
                          <Text style={styles.label}>Vergi No</Text>
                          <Text style={styles.value}>{item?.taxNo}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.copyBtn}
                          onPress={() =>
                            handleCopy(item?.taxNo, `tax-no-${idx}`)
                          }
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
            : !isUpdated && (
                <Text style={styles.noDataText}>Şirket bilgisi bulunamadı</Text>
              )}

          {/* Bank Accounts */}
          <Text style={styles.sectionTitle}>Banka Bilgileri</Text>

          {isUpdated && (
            <TouchableOpacity
              style={styles.addButtonFull}
              onPress={handleAddBankInfo}
            >
              <Text style={styles.addButtonText}>Banka Ekle</Text>
              <Plus size={16} color="#7196AC" />
            </TouchableOpacity>
          )}

          {bankAccounts.length > 0
            ? bankAccounts.map((item: any, idx: number) => (
                <View key={idx} style={styles.card}>
                  {isUpdated ? (
                    <>
                      <TextInput
                        style={styles.input}
                        value={item?.bankName}
                        onChangeText={(v) =>
                          handleBankInfoChange(idx, "bankName", v)
                        }
                        placeholder="Banka Adı"
                        placeholderTextColor="#666"
                      />
                      <TextInput
                        style={styles.input}
                        value={item?.iban}
                        onChangeText={(v) =>
                          handleBankInfoChange(idx, "iban", v)
                        }
                        placeholder="IBAN"
                        placeholderTextColor="#666"
                      />
                      <TextInput
                        style={styles.input}
                        value={item?.holderName}
                        onChangeText={(v) =>
                          handleBankInfoChange(idx, "holderName", v)
                        }
                        placeholder="Hesap Sahibi"
                        placeholderTextColor="#666"
                      />
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteBankInfo(idx)}
                      >
                        <Trash2 size={20} color="#ff6b6b" />
                        <Text style={styles.deleteBtnText}>Sil</Text>
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
            : !isUpdated && (
                <Text style={styles.noDataText}>Banka bilgisi bulunamadı</Text>
              )}

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
  container: { flex: 1, backgroundColor: "#141e22" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
    marginTop: 8,
  },
  addButtonFull: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#10181B",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: { fontSize: 14, fontWeight: "600", color: "#7196AC" },
  card: {
    backgroundColor: "#1B272C",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#273034",
    color: "#fff",
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    backgroundColor: "#273034",
    paddingVertical: 12,
    borderRadius: 8,
  },
  deleteBtnText: { fontSize: 14, fontWeight: "600", color: "#ff6b6b" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#273034",
  },
  infoLeft: { flex: 1 },
  label: { fontSize: 13, color: "#8E8E8E", marginBottom: 4 },
  value: { fontSize: 15, color: "#fff", fontWeight: "500" },
  copyBtn: { padding: 8 },
  noDataText: {
    fontSize: 15,
    color: "#8E8E8E",
    textAlign: "center",
    marginTop: 20,
  },
  actionButtons: { flexDirection: "row", gap: 10, marginTop: 20 },
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
  saveButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
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
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});
