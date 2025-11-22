import { getOtherCompanyData } from '@/redux/slices/CompanySlice';
import { getOtherMarketingAssetsData } from '@/redux/slices/MarketingAssetsSlice';
import { getOtherSocialMediaData } from '@/redux/slices/SocialMediaSlice';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import { Check, Copy, Link as LinkIcon, Mail, MapPin, MessageCircle, Phone, Printer } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import OtherProfileHeader from '../../../components/layout/OtherProfileHeader';
import { getOtherProfileData } from '../../../redux/slices/ProfileSlice';
import { getOtherUserImages } from '../../../redux/slices/UserImagesSlice';
import { AppDispatch, RootState } from '../../../redux/store';

export default function OtherProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSelector((state: RootState) => state.profile);
  const { bannerImg, profileImg } = useSelector((state: RootState) => state.userImages);
  const [copied, setCopied] = useState<number | null>(null);


  useEffect(() => {
    if (id) {
      dispatch(getOtherCompanyData({ cardId: id }));
      dispatch(getOtherUserImages({ cardId: id }));
      dispatch(getOtherProfileData({ cardId: id }));
      dispatch(getOtherSocialMediaData({ cardId: id }));
      dispatch(getOtherMarketingAssetsData({ cardId: id }));
    }
  }, [id, dispatch]);


  const handleCopy = async (itemId: number, text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(itemId);
      setTimeout(() => setCopied(null), 2000);
      Toast.show({
        type: 'success',
        text1: 'Kopyalandı',
        visibilityTime: 1500,
      });
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const handleContactPress = (type: string, value: string) => {
    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'whatsapp':
        Linking.openURL(`https://wa.me/${value.replace(/[^0-9]/g, '')}`);
        break;
      case 'location':
        Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(value)}`);
        break;
      default:
        if (value.startsWith('http')) {
          Linking.openURL(value);
        }
    }
  };

  const getContactIcon = (type: string) => {
    const iconProps = { size: 18, color: '#7196AC' };
    switch (type) {
      case 'phone':
        return <Phone {...iconProps} />;
      case 'email':
        return <Mail {...iconProps} />;
      case 'whatsapp':
        return <MessageCircle {...iconProps} />;
      case 'location':
        return <MapPin {...iconProps} />;
      case 'fax':
        return <Printer {...iconProps} />;
      default:
        return <LinkIcon {...iconProps} />;
    }
  };

  if (isLoading && !data) {
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
          profileData={data}
          bannerImg={bannerImg}
          profileImg={profileImg}
          cardId={id}
        />

        <View style={styles.content}>
          {/* Contact Infos */}
          <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>

          <View style={styles.section}>
            {data?.contactInfos && data.contactInfos.length > 0 ? (
              data.contactInfos.map((item: any, idx: number) => (
                <View key={idx} style={styles.contactItemWrapper}>
                  <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => handleContactPress(item.contactType, item.value)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.contactLeft}>
                      <View style={styles.iconCircle}>
                        {getContactIcon(item.contactType)}
                      </View>
                      <Text style={styles.contactText}>{item.value}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.copyBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleCopy(item.id, item.value);
                      }}
                    >
                      {copied === item.id ? (
                        <Check size={18} color="#70C094" />
                      ) : (
                        <Copy size={18} color="#8E8E8E" />
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>İletişim bilgisi bulunamadı</Text>
            )}
          </View>

          {/* Links */}
          <Text style={styles.sectionTitle}>Linkler</Text>

          <View style={styles.section}>
            {data?.links && data.links.length > 0 ? (
              [...(data?.links ?? [])]
                .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
                .map((item: any, idx: number) => (
                  <View key={idx} style={styles.contactItemWrapper}>
                    <TouchableOpacity
                      style={styles.contactItem}
                      onPress={() => Linking.openURL(item.value)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.contactLeft}>
                        <View style={styles.iconCircle}>
                          <LinkIcon size={18} color="#7196AC" />
                        </View>
                        <Text style={styles.contactText}>{item.value}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCopy(item.id, item.value);
                        }}
                      >
                        {copied === item.id ? (
                          <Check size={18} color="#70C094" />
                        ) : (
                          <Copy size={18} color="#8E8E8E" />
                        )}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                ))
            ) : (
              <Text style={styles.noDataText}>Link bulunamadı</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141e22',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#141e22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  contactItemWrapper: {
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1B272C',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#273034',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 15,
    color: '#fff',
    flex: 1,
  },
  copyBtn: {
    padding: 8,
  },
  noDataText: {
    fontSize: 15,
    color: '#8E8E8E',
    textAlign: 'center',
    marginTop: 20,
  },
});
