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

const normalizeFile = (
  file: RNFile,
  defaultName: string,
  defaultType: string
) => {
  return {
    uri: file.uri,
    name: file.fileName || file.name || defaultName,
    type: file.mimeType || file.type || defaultType,
  };
};


export default function MarketingAssetsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSelector(
    (state: RootState) => state.marketingAssets
  );
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
        formData.append(
          "coverPhoto",
          normalizeFile(coverPhoto, "cover.png", "image/png") as any
        );
      }

      formData.append(
        "url",
        normalizeFile(pdfFile, "catalog.pdf", "application/pdf") as any
      );

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
        text1:
          err?.response?.data?.message ||
          "Katalog oluşturulurken hata oluştu",
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
          <Text style={styles.sectionTitle}>Kataloglar</Text>

          {isUpdated && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowModal(true)}
            >
              <View style={styles.addCircle}>
                <Plus size={24} color="#7196AC" />
              </View>
              <Text style={styles.addText}>Katalog Ekle</Text>
            </TouchableOpacity>
          )}

          {data && data.length > 0 ? (
            <View style={styles.grid}>
              {data.map((item: any, idx: number) => (
                <View key={idx} style={styles.cardWrapper}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => handleCardPress(item.url)}
                    activeOpacity={isUpdated ? 1 : 0.8}
                  >
                    <View style={styles.imageContainer}>
                      {item.coverPhoto ? (
                        <Image
                          source={{ uri: item.coverPhoto }}
                          style={styles.image}
                        />
                      ) : (
                        <View style={styles.placeholderImage}>
                          <Text style={styles.placeholderText}>📄</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {isUpdated && (
                    <TouchableOpacity
                      style={styles.deleteBtn}
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
              <Text style={styles.noDataText}>Katalog bulunamadı</Text>
            )
          )}
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Katalog Ekle</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setCatalogName("Örnek Başlık");
                  setCoverPhoto(null);
                  setPdfFile(null);
                }}
              >
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* NAME */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Katalog Adı</Text>
                <TextInput
                  style={styles.input}
                  value={catalogName}
                  onChangeText={setCatalogName}
                  placeholder="Katalog adı girin"
                  placeholderTextColor="#666"
                  maxLength={50}
                />
                <Text
                  style={[
                    styles.charCount,
                    catalogName.length === 50 && styles.charCountMax,
                  ]}
                >
                  {catalogName.length}/50
                </Text>
              </View>

              {/* COVER PHOTO */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kapak Fotoğrafı</Text>
                <TouchableOpacity
                  style={styles.fileButton}
                  onPress={handlePickCoverPhoto}
                >
                  <ImageIcon size={20} color="#7196AC" />
                  <Text style={styles.fileButtonText}>
                    {coverPhoto ? coverPhoto.fileName || "Seçildi ✓" : "Fotoğraf Seç"}
                  </Text>
                </TouchableOpacity>

                {coverPhoto && (
                  <Image
                    source={{ uri: coverPhoto.uri }}
                    style={styles.preview}
                  />
                )}
              </View>

              {/* PDF */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PDF/Dosya</Text>
                <TouchableOpacity
                  style={styles.fileButton}
                  onPress={handlePickPDF}
                >
                  <FileText size={20} color="#7196AC" />
                  <Text style={styles.fileButtonText}>
                    {pdfFile ? pdfFile.name : "PDF Seç"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* BUTTONS */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowModal(false);
                  setCatalogName("Örnek Başlık");
                  setCoverPhoto(null);
                  setPdfFile(null);
                }}
              >
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
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
  container: { flex: 1, backgroundColor: "#141e22" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  addButton: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: "#1B272C",
    borderRadius: 12,
  },
  addCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#273034",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  addText: { fontSize: 14, fontWeight: "600", color: "#7196AC" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 15 },
  cardWrapper: { width: "47%", position: "relative" },
  card: {
    backgroundColor: "#1B272C",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 5,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: "#273034",
  },
  image: { width: "100%", height: "100%" },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { fontSize: 48 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: "600", color: "#fff" },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#1c1f24",
    padding: 8,
    borderRadius: 20,
  },
  noDataText: {
    fontSize: 15,
    color: "#8E8E8E",
    textAlign: "center",
    marginTop: 40,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1B272C",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  modalScroll: { maxHeight: 500 },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#8E8E8E" },
  input: {
    backgroundColor: "#273034",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  charCount: {
    textAlign: "right",
    color: "#8E8E8E",
    fontSize: 12,
    marginTop: 5,
  },
  charCountMax: { color: "#ff6b6b" },

  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#273034",
    padding: 15,
    borderRadius: 8,
  },
  fileButtonText: { color: "#7196AC", fontWeight: "500", flex: 1 },

  preview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#273034",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
  },
  cancelText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  submitBtn: {
    flex: 1,
    backgroundColor: "#70C094",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
