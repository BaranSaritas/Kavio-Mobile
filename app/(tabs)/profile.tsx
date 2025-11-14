import { getUserImages } from "@/redux/slices/UserSlice";
import { Edit, QrCode, Save, X } from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import ContactInfo from "../../components/profile/ContactInfo";
import Links from "../../components/profile/Links";
import PersonalInfo from "../../components/profile/PersonalInfo";
import {
  getProfileData,
  resetProfile,
  updateProfileData,
} from "../../redux/slices/ProfileSlice";
import { setUpdatedPage } from "../../redux/slices/UpdatePageSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { updatePageChecker } from "../../utils/helpers";

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { updatedPage } = useSelector((state: RootState) => state.updatePage);
  const { isSuccess, isError, message, data, isLoading } = useSelector(
    (state: RootState) => state.profile
  );
  const { images } = useSelector((state: RootState) => state.user);

  const { user } = useSelector((state: RootState) => state.user);

  const isUpdated = updatePageChecker("/(tabs)/profile", updatedPage);
  const cardId = user?.cardId;

  useEffect(() => {
    if (cardId) {
      console.log("Fetching profile data for cardId:", cardId);
      dispatch(getProfileData({ cardId }));
      dispatch(getUserImages()).unwrap();

    }
  }, [cardId, dispatch]);

  useEffect(() => {
    console.log("Profile data:", data);
  }, [data]);

  const handleProfileDataUpdate = async () => {
    console.log("Updating profile data:", data);
    const res = await dispatch(updateProfileData(data));
    if (res?.meta?.requestStatus === "fulfilled") {
      dispatch(getProfileData({ cardId }));
      dispatch(setUpdatedPage(null));
      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Profil güncellendi",
      });
    }
  };

  useEffect(() => {
    if (isSuccess && message) {
      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: message,
      });
    }
    if (isError && message) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: message,
      });
    }
    return () => {
      dispatch(resetProfile());
    };
  }, [dispatch, isSuccess, isError, message]);

  // İlk yükleme durumu
  if (isLoading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7196AC" />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

  // Data yoksa
  if (!data && !isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Profil verisi bulunamadı</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => cardId && dispatch(getProfileData({ cardId }))}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: images?.bannerImg || "https://via.placeholder.com/800x300",
            }}
            style={styles.banner}
            resizeMode="cover"
          />

          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: images?.profileImg || "https://via.placeholder.com/200",
              }}
              style={styles.avatar}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                dispatch(setUpdatedPage(isUpdated ? null : "/(tabs)/profile"))
              }
            >
              <Edit size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn}>
              <QrCode size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {data?.userInfo?.firstName || "Ad"}{" "}
            {data?.userInfo?.lastName || "Soyad"}
          </Text>
          <Text style={styles.bio}>
            {data?.userInfo?.bio || "Ünvan belirtilmemiş"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <PersonalInfo isUpdated={isUpdated} />
        {isUpdated && <ContactInfo />}
        <Links isUpdated={isUpdated} />

        {/* Save/Cancel Buttons */}
        {isUpdated && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleProfileDataUpdate}
            >
              <Save size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => dispatch(setUpdatedPage(null))}
            >
              <X size={20} color="#fff" />
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        )}
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
    backgroundColor: "#141e22",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E8E",
    marginTop: 15,
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3C616D",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    marginBottom: 20,
  },
  bannerContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -45,
    left: 24,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#141e22",
    overflow: "hidden",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  actions: {
    position: "absolute",
    right: 15,
    bottom: 15,
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    backgroundColor: "#1c1f24",
    padding: 8,
    borderRadius: 10,
  },
  userInfo: {
    marginTop: 60,
    paddingHorizontal: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  bio: {
    fontSize: 14,
    color: "#A2A2A2",
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
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
