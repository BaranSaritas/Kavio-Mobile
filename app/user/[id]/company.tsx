import { getOtherMarketingAssetsData } from "@/redux/slices/MarketingAssetsSlice";
import { getOtherProfileData } from "@/redux/slices/ProfileSlice";
import { getOtherSocialMediaData } from "@/redux/slices/SocialMediaSlice";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Check, Copy } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import OtherProfileHeader from "../../../components/layout/OtherProfileHeader";
import { getOtherCompanyData } from "../../../redux/slices/CompanySlice";
import { getOtherUserImages } from "../../../redux/slices/UserImagesSlice";
import { AppDispatch, RootState } from "../../../redux/store";

export default function OtherCompanyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSelector((state: RootState) => state.company);
  const { data: profileData } = useSelector((state: RootState) => state.profile);
  const { bannerImg, profileImg } = useSelector((state: RootState) => state.userImages);
  const [copied, setCopied] = useState<string | null>(null);

  const safeData = data ?? {};
  const companyInfos = safeData.companyInfos ?? [];
  const bankAccounts = safeData.bankAccounts ?? [];

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
          {/* Company Infos */}
          <Text style={styles.sectionTitle}>Şirket Bilgileri</Text>

          {companyInfos.length > 0 ? (
            companyInfos.map((item: any, idx: number) => (
              <View key={idx} style={styles.card}>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <Text style={styles.label}>Şirket Adı</Text>
                    <Text style={styles.value}>{item?.name}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => handleCopy(item?.name, `company-name-${idx}`)}
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
                    onPress={() => handleCopy(item?.taxBody, `tax-body-${idx}`)}
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
                    onPress={() => handleCopy(item?.address, `address-${idx}`)}
                  >
                    {copied === `address-${idx}` ? (
                      <Check size={18} color="#70C094" />
                    ) : (
                      <Copy size={18} color="#8E8E8E" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Şirket bilgisi bulunamadı</Text>
          )}

          {/* Bank Accounts */}
          <Text style={styles.sectionTitle}>Banka Bilgileri</Text>

          {bankAccounts.length > 0 ? (
            bankAccounts.map((item: any, idx: number) => (
              <View key={idx} style={styles.card}>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <Text style={styles.label}>Banka Adı</Text>
                    <Text style={styles.value}>{item?.bankName}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => handleCopy(item?.bankName, `bank-name-${idx}`)}
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
                    onPress={() => handleCopy(item?.holderName, `holder-${idx}`)}
                  >
                    {copied === `holder-${idx}` ? (
                      <Check size={18} color="#70C094" />
                    ) : (
                      <Copy size={18} color="#8E8E8E" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Banka bilgisi bulunamadı</Text>
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
  card: {
    backgroundColor: "#1B272C",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
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
});
