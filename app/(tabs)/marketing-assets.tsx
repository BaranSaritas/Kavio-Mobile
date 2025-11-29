import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../api/axiosInstance";
import ProfileHeader from "../../components/layout/ProfileHeader";
import { useTheme } from "../../hooks/useTheme";
import {
  deleteMarketingAssetsData,
  getMarketingAssetsData,
} from "../../redux/slices/MarketingAssetsSlice";
import { getUserImages } from "../../redux/slices/UserImagesSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { updatePageChecker } from "../../utils/helpers";

const CURRENT_PAGE = "/(tabs)/marketing-assets";

type RNFile = {
  uri: string;
  name?: string;
  fileName?: string;
  mimeType?: string;
  type?: string;
  size?: number;
};

const normalizeFile = (file: RNFile, defaultName: string, defaultType: string) => {
  return {
    uri: file.uri,
    name: file.fileName || file.name || defaultName,
    type: file.mimeType || file.type || defaultType,
  };
};

export default function MarketingAssetsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { data, isLoading } = useSelector((state: RootState) => state.marketingAssets);
  const { updatedPage } = useSelector((state: RootState) => state.updatePage);
  const { user } = useSelector((state: RootState) => state.user);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [catalogName, setCatalogName] = useState("Örnek Başlık");
  const [coverPhoto, setCoverPhoto] = useState<any>(null);
  const [pdfFile, setPdfFile] = useState<any>(null);

  const cardId = user?.cardId;
  const isUpdated = updatePageChecker(CURRENT_PAGE, updatedPage);

  useEffect(() => {
    if (cardId) {
      dispatch(getMarketingAssetsData({ cardId }));
      dispatch(getUserImages({ cardId }));
    }
  }, [cardId, dispatch]);

  const handlePickCoverPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        setCoverPhoto(result.assets[0]);
      }
    } catch {
      Toast.show({ type: "error", text1: "Resim seçilemedi" });
    }
  };

  const handlePickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];
        setPdfFile({
          uri: file.uri,
          name: file.name || "document.pdf",
          mimeType: file.mimeType || "application/pdf",
        });
      }
    } catch {
      Toast.show({ type: "error", text1: "Dosya seçilemedi" });
    }
  };

  const handleSubmit = async () => {
    if (!catalogName.trim()) {
      Toast.show({ type: "error", text1: "Başlık boş olamaz" });
      return;
    }
    if (!pdfFile) {
      Toast.show({ type: "error", text1: "PDF seçmelisiniz" });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", catalogName);
      formData.append("cardId", String(cardId));

      if (coverPhoto) {
        formData.append("coverPhoto", normalizeFile(coverPhoto, "cover.png", "image/png") as any);
      }

      formData.append("url", normalizeFile(pdfFile, "catalog.pdf", "application/pdf") as any);

      const response = await Axios.post("/catalogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        Toast.show({ type: "success", text1: "Katalog oluşturuldu" });
        setShowModal(false);
        setCatalogName("Örnek Başlık");
        setCoverPhoto(null);
        setPdfFile(null);
        dispatch(getMarketingAssetsData({ cardId }));
      }
    } catch (err: any) {
      console.log("UPLOAD ERROR", err);
      Toast.show({
        type: "error",
        text1: err?.response?.data?.message || "Katalog oluşturulurken hata oluştu",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (catalogId: number) => {
    const res = await dispatch(deleteMarketingAssetsData({ catalogId }));
    if (res?.meta?.requestStatus === "fulfilled") {
      dispatch(getMarketingAssetsData({ cardId }));
      Toast.show({ type: "success", text1: "Katalog silindi" });
    }
  };

  const handleCardPress = (url: string) => {
    if (url && !isUpdated) {
      Linking.openURL(url).catch(() => {
        Toast.show({ type: "error", text1: "Link açılamadı" });
      });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.activeMenuColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader currentPage={CURRENT_PAGE} />

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Kataloglar</Text>

          {isUpdated && (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.menuBackgroundColor }]}
              onPress={() => setShowModal(true)}
            >
              <View style={[styles.addCircle, { backgroundColor: theme.headerBackgroundColor }]}>
                <Plus size={24} color={theme.activeMenuColor} />
              </View>
              <Text style={[styles.addText, { color: theme.activeMenuColor }]}>Katalog Ekle</Text>
            </TouchableOpacity>
          )}

          {data && data.length > 0 ? (
            <View style={styles.grid}>
              {data.map((item: any, idx: number) => (
                <View key={idx} style={styles.cardWrapper}>
                  <TouchableOpacity
                    style={[styles.card, { backgroundColor: theme.menuBackgroundColor }]}
                    onPress={() => handleCardPress(item.url)}
                    activeOpacity={isUpdated ? 1 : 0.8}
                  >
                    <View style={[styles.imageContainer, { backgroundColor: theme.headerBackgroundColor }]}>
                      {item.coverPhoto ? (
                        <Image source={{ uri: item.coverPhoto }} style={styles.image} />
                      ) : (
                        <View style={styles.placeholderImage}>
                          <Text style={styles.placeholderText}>📄</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardTitle, { color: theme.textColor }]} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {isUpdated && (
                    <TouchableOpacity
                      style={[styles.deleteBtn, { backgroundColor: theme.activeMenuBackgroundColor }]}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Trash2 size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          ) : (
            !isUpdated && (
              <Text style={[styles.noDataText, { color: theme.labelColor }]}>Katalog bulunamadı</Text>
            )
          )}
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.menuBackgroundColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>Katalog Ekle</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setCatalogName("Örnek Başlık");
                  setCoverPhoto(null);
                  setPdfFile(null);
                }}
              >
                <X size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* NAME */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.labelColor }]}>Katalog Adı</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.headerBackgroundColor, color: theme.textColor }]}
                  value={catalogName}
                  onChangeText={setCatalogName}
                  placeholder="Katalog adı girin"
                  placeholderTextColor={theme.labelColor}
                  maxLength={50}
                />
                <Text style={[styles.charCount, { color: theme.labelColor }, catalogName.length === 50 && styles.charCountMax]}>
                  {catalogName.length}/50
                </Text>
              </View>

              {/* COVER PHOTO */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.labelColor }]}>Kapak Fotoğrafı</Text>
                <TouchableOpacity
                  style={[styles.fileButton, { backgroundColor: theme.headerBackgroundColor }]}
                  onPress={handlePickCoverPhoto}
                >
                  <ImageIcon size={20} color={theme.activeMenuColor} />
                  <Text style={[styles.fileButtonText, { color: theme.activeMenuColor }]}>
                    {coverPhoto ? coverPhoto.fileName || "Seçildi ✓" : "Fotoğraf Seç"}
                  </Text>
                </TouchableOpacity>

                {coverPhoto && (
                  <Image source={{ uri: coverPhoto.uri }} style={styles.preview} />
                )}
              </View>

              {/* PDF */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.labelColor }]}>PDF/Dosya</Text>
                <TouchableOpacity
                  style={[styles.fileButton, { backgroundColor: theme.headerBackgroundColor }]}
                  onPress={handlePickPDF}
                >
                  <FileText size={20} color={theme.activeMenuColor} />
                  <Text style={[styles.fileButtonText, { color: theme.activeMenuColor }]}>
                    {pdfFile ? pdfFile.name : "PDF Seç"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* BUTTONS */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: theme.headerBackgroundColor }]}
                onPress={() => {
                  setShowModal(false);
                  setCatalogName("Örnek Başlık");
                  setCoverPhoto(null);
                  setPdfFile(null);
                }}
              >
                <Text style={[styles.cancelText, { color: theme.textColor }]}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: theme.submitButtonBackgroundColor }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Oluştur</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  addButton: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 20,
    borderRadius: 12,
  },
  addCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  addText: { fontSize: 14, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 15 },
  cardWrapper: { width: "47%", position: "relative" },
  card: { borderRadius: 12, overflow: "hidden", marginBottom: 5 },
  imageContainer: { width: "100%", height: 140 },
  image: { width: "100%", height: "100%" },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { fontSize: 48 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: "600" },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
  },
  noDataText: { fontSize: 15, textAlign: "center", marginTop: 40 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "90%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "700" },
  modalScroll: { maxHeight: 500 },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: "600" },
  input: { padding: 15, borderRadius: 8, fontSize: 16 },
  charCount: { textAlign: "right", fontSize: 12, marginTop: 5 },
  charCountMax: { color: "#ff6b6b" },

  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderRadius: 8,
  },
  fileButtonText: { fontWeight: "500", flex: 1 },
  preview: { width: "100%", height: 150, borderRadius: 8, marginTop: 10 },

  modalActions: { flexDirection: "row", gap: 10, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 15, alignItems: "center", borderRadius: 8 },
  cancelText: { fontSize: 16, fontWeight: "600" },
  submitBtn: { flex: 1, padding: 15, alignItems: "center", borderRadius: 8 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
