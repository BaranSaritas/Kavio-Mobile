import { getOtherCompanyData } from "@/redux/slices/CompanySlice";
import { getOtherProfileData } from "@/redux/slices/ProfileSlice";
import { getOtherSocialMediaData } from "@/redux/slices/SocialMediaSlice";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import OtherProfileHeader from "../../../components/layout/OtherProfileHeader";
import { getOtherMarketingAssetsData } from "../../../redux/slices/MarketingAssetsSlice";
import { getOtherUserImages } from "../../../redux/slices/UserImagesSlice";
import { AppDispatch, RootState } from "../../../redux/store";

export default function OtherMarketingAssetsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSelector(
    (state: RootState) => state.marketingAssets
  );
  const { data: profileData } = useSelector((state: RootState) => state.profile);
  const { bannerImg, profileImg } = useSelector((state: RootState) => state.userImages);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        dispatch(getOtherCompanyData({ cardId: id }));
        dispatch(getOtherUserImages({ cardId: id }));
        dispatch(getOtherProfileData({ cardId: id }));
        dispatch(getOtherSocialMediaData({ cardId: id }));
        dispatch(getOtherMarketingAssetsData({ cardId: id }));
      }
    }, [id, dispatch])
  );


  const handleCardPress = (url: string) => {
    if (url) {
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
        <OtherProfileHeader
          profileData={profileData}
          bannerImg={bannerImg}
          profileImg={profileImg}
          cardId={id}
        />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Kataloglar</Text>

          {data && data.length > 0 ? (
            <View style={styles.grid}>
              {data.map((item: any, idx: number) => (
                <View key={idx} style={styles.cardWrapper}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => handleCardPress(item.url)}
                    activeOpacity={0.8}
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
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>Katalog bulunamadı</Text>
          )}
        </View>
      </ScrollView>
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
  noDataText: {
    fontSize: 15,
    color: "#8E8E8E",
    textAlign: "center",
    marginTop: 40,
  },
});
