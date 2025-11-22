import { getOtherCompanyData } from '@/redux/slices/CompanySlice';
import { getOtherMarketingAssetsData } from '@/redux/slices/MarketingAssetsSlice';
import { getOtherProfileData } from '@/redux/slices/ProfileSlice';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  ExternalLink,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OtherProfileHeader from '../../../components/layout/OtherProfileHeader';
import {
  getOtherSocialMediaData,
} from '../../../redux/slices/SocialMediaSlice';
import { getOtherUserImages } from '../../../redux/slices/UserImagesSlice';
import { AppDispatch, RootState } from '../../../redux/store';

const getSocialIcon = (platform: string, size = 32) => {
  const iconProps = { size, color: '#fff' };
  const platformLower = platform.toLowerCase();
  
  switch (platformLower) {
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'twitter':
    case 'x':
      return <Twitter {...iconProps} />;
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    case 'github':
      return <Github {...iconProps} />;
    case 'pinterest':
      return <Globe {...iconProps} />;
    default:
      return <Globe {...iconProps} />;
  }
};

const getPlatformDisplayName = (platform: string) => {
  const platformLower = platform.toLowerCase();
  const names: { [key: string]: string } = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    x: 'X (Twitter)',
    twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    github: 'GitHub',
    pinterest: 'Pinterest',
  };
  return names[platformLower] || platform;
};

export default function OtherSocialMediaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSelector(
    (state: RootState) => state.socialMedia
  );
  const { data: profileData } = useSelector((state: RootState) => state.profile);
  const { bannerImg, profileImg } = useSelector((state: RootState) => state.userImages);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [platformLinks, setPlatformLinks] = useState<any[]>([]);


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


  // Group platforms by platform name
  const groupedPlatforms = data?.reduce((acc: any, item: any) => {
    const platform = item.platform;
    if (!acc[platform]) {
      acc[platform] = [];
    }
    acc[platform].push(item);
    return acc;
  }, {});

  const platformKeys = groupedPlatforms ? Object.keys(groupedPlatforms) : [];

  const handlePlatformPress = (platform: string) => {
    setSelectedPlatform(platform);
    setPlatformLinks(groupedPlatforms[platform] || []);
    setShowModal(true);
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
          <Text style={styles.sectionTitle}>Sosyal Medya</Text>
          
          {/* Existing Platforms */}
          <View style={styles.grid}>
            {platformKeys.length > 0 ? (
              platformKeys.map((platform: string, idx: number) => (
                <View key={idx} style={styles.iconWrapper}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handlePlatformPress(platform)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconCircle}>
                      {getSocialIcon(platform)}
                    </View>
                  </TouchableOpacity>
                  {groupedPlatforms[platform].length > 1 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{groupedPlatforms[platform].length}</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Sosyal medya hesabı bulunamadı</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Platform Links Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalPlatform}>
                {selectedPlatform && getSocialIcon(selectedPlatform, 28)}
                <Text style={styles.modalTitle}>
                  {selectedPlatform ? getPlatformDisplayName(selectedPlatform) : ''}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setSelectedPlatform(null);
                }}
              >
                <ExternalLink size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Links List */}
            <ScrollView style={styles.linksList}>
              {platformLinks && platformLinks.length > 0 ? (
                platformLinks.map((link: any, idx: number) => (
                  <View key={link.id || idx} style={styles.linkItem}>
                    <TouchableOpacity
                      style={styles.linkTextWrapper}
                      onPress={() => {
                        const url = link.usernameOrUrl.startsWith('http') 
                          ? link.usernameOrUrl 
                          : `https://${link.usernameOrUrl}`;
                        Linking.openURL(url);
                      }}
                    >
                      <Text style={styles.linkText} numberOfLines={1}>
                        {link.usernameOrUrl}
                      </Text>
                      <ExternalLink size={16} color="#7196AC" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noLinksText}>Link bulunamadı</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141e22' },
  centerContainer: { flex: 1, backgroundColor: '#141e22', justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  iconWrapper: { width: '30%', position: 'relative' },
  iconButton: { aspectRatio: 1 },
  iconCircle: { flex: 1, backgroundColor: '#1B272C', borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#70C094', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  noDataText: { fontSize: 16, color: '#8E8E8E', textAlign: 'center', width: '100%', marginTop: 40 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1B272C', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalPlatform: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  linksList: { maxHeight: 400 },
  linkItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#273034', padding: 12, borderRadius: 8, marginBottom: 10 },
  linkTextWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  linkText: { fontSize: 15, color: '#fff', flex: 1 },
  noLinksText: { fontSize: 15, color: '#8E8E8E', textAlign: 'center', marginTop: 20 },
});
