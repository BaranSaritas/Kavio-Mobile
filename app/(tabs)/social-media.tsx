import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Plus,
  Save,
  Twitter,
  X,
  Youtube,
  Music2,
  MapPin,
  Camera,
  Palette,
  Disc3,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from '../../components/layout/ProfileHeader';
import {
  getSocialMediaData,
  getSocialMediaPlatformsData,
  resetSocialMedia,
  setAddedSocialMediaPlatforms,
  setUpdateSocialMedia,
  updateSocialMedia,
} from '../../redux/slices/SocialMediaSlice';
import { setUpdatedPage } from '../../redux/slices/UpdatePageSlice';
import { getUserImages } from '../../redux/slices/UserImagesSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { updatePageChecker } from '../../utils/helpers';

const CURRENT_PAGE = '/(tabs)/social-media';

const getSocialIcon = (platform: string, size: number = 32) => {
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
    case 'spotify':
      return <Music2 {...iconProps} />;
    case 'pinterest':
      return <MapPin {...iconProps} />;
    case 'snapchat':
      return <Camera {...iconProps} />;
    case 'behance':
      return <Palette {...iconProps} />;
    case 'dribbble':
      return <Disc3 {...iconProps} />;
    default:
      return <Instagram {...iconProps} />;
  }
};

export default function SocialMediaScreen() {
const dispatch = useDispatch<AppDispatch>();
  const { data, socialMediaPlatforms, isLoading, addedSocialMediaPlatforms } = useSelector(
    (state: RootState) => state.socialMedia
  );
  const { updatedPage } = useSelector((state: RootState) => state.updatePage);
  const { user } = useSelector((state: RootState) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [linkValue, setLinkValue] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null); // Hangi item edit ediliyor

  const cardId = user?.cardId;
  const isUpdated = updatePageChecker(CURRENT_PAGE, updatedPage);

  useEffect(() => {
    if (cardId) {
      dispatch(getSocialMediaData({ cardId }));
      dispatch(getSocialMediaPlatformsData({}));
      dispatch(getUserImages({ cardId }));
    }
  }, [cardId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetSocialMedia());
    };
  }, [dispatch]);

  const filteredPlatforms = socialMediaPlatforms?.filter((platform: any) =>
    data?.some((d: any) => d.platform === platform.name)
  );

  const availablePlatforms = socialMediaPlatforms?.filter((item: any) =>
    !data?.some((d: any) => d.platform === item.name)
  );

  const handleSocialMediaPress = (item: any) => {
    if (isUpdated) {
      // Edit modda - link düzenle
      const socialMediaItem = data?.find((d: any) => d.platform === item.name);
      setSelectedPlatform(item);
      setLinkValue(socialMediaItem?.usernameOrUrl || '');
      setShowModal(true);
    } else {
      // Normal modda - link aç
      const socialMediaItem = data?.find((d: any) => d.platform === item.name);
      if (socialMediaItem?.usernameOrUrl) {
        // URL formatını kontrol et
        let url = socialMediaItem.usernameOrUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        Linking.openURL(url);
      } else {
        Toast.show({
          type: 'info',
          text1: 'Link bulunamadı',
        });
      }
    }
  };

  const handleAddPlatform = (platform: any) => {
    // Aynı platformdan birden fazla eklenebilir, kontrol kaldırıldı
    setSelectedPlatform(platform);
    setLinkValue('');
    setEditingItem(null); // Yeni ekleme için null
    setShowModal(true);
  };

  const handleDeleteLink = () => {
    if (editingItem && editingItem.id) {
      // Mevcut item'i sil
      const updatedData = data.filter((d: any) => d.id !== editingItem.id);
      dispatch(setUpdateSocialMedia(updatedData));
    }

    setShowModal(false);
    setSelectedPlatform(null);
    setLinkValue('');
    setEditingItem(null);
  };

  const handleSaveLink = () => {
    if (!linkValue.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Link boş olamaz',
      });
      return;
    }

    if (editingItem && editingItem.id) {
      // Mevcut item'ı güncelle
      const updatedData = data.map((d: any) =>
        d.id === editingItem.id ? { ...d, usernameOrUrl: linkValue } : d
      );
      dispatch(setUpdateSocialMedia(updatedData));
    } else {
      // Aynı URL kontrolu
      const existingItem = data?.find(
        (d: any) => d.platform === selectedPlatform.name && d.usernameOrUrl === linkValue
      );

      if (existingItem) {
        Toast.show({
          type: 'info',
          text1: 'Bu hesap zaten ekli',
        });
        return;
      }

      // Yeni ekle
      const newItem = {
        platform: selectedPlatform.name,
        usernameOrUrl: linkValue,
      };
      dispatch(setAddedSocialMediaPlatforms([...addedSocialMediaPlatforms, newItem]));
    }

    setShowModal(false);
    setSelectedPlatform(null);
    setLinkValue('');
    setEditingItem(null);
  };

  const handleSave = async () => {
    const mergedData = [...(data || []), ...addedSocialMediaPlatforms];
    const res = await dispatch(updateSocialMedia({ cardId, updatedData: mergedData }));
    if (res?.meta?.requestStatus === 'fulfilled') {
      dispatch(getSocialMediaData({ cardId }));
      dispatch(getSocialMediaPlatformsData({}));
      dispatch(setUpdatedPage(null));
      dispatch(setAddedSocialMediaPlatforms([]));
      Toast.show({
        type: 'success',
        text1: 'Kaydedildi',
      });
    }
  };

  const handleCancel = () => {
    dispatch(getSocialMediaData({ cardId }));
    dispatch(setUpdatedPage(null));
    dispatch(setAddedSocialMediaPlatforms([]));
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
          <Text style={styles.sectionTitle}>Sosyal Medya</Text>
          
          {/* Tüm Platformlar - Ekle */}
          {isUpdated && socialMediaPlatforms && socialMediaPlatforms.length > 0 && (
            <View style={styles.availablePlatformsContainer}>
              <Text style={styles.availablePlatformsTitle}>Platform Seç:</Text>
              <View style={styles.availablePlatformsGrid}>
                {socialMediaPlatforms.map((platform: any, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.availablePlatformButton}
                    onPress={() => handleAddPlatform(platform)}
                  >
                    <View style={styles.smallIconCircle}>
                      {getSocialIcon(platform.name, 24)}
                    </View>
                    <Text style={styles.availablePlatformText}>{platform.displayName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Mevcut Sosyal Medya Hesapları */}
          <View style={styles.grid}>
            {data && data.length > 0 ? (
              data.map((item: any, idx: number) => {
                const platformInfo = socialMediaPlatforms?.find(
                  (p: any) => p.name === item.platform
                );
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.iconButton}
                    onPress={() => {
                      if (isUpdated) {
                        setSelectedPlatform(platformInfo);
                        setLinkValue(item?.usernameOrUrl || '');
                        setEditingItem(item); // Edit edilen item'i sakla
                        setShowModal(true);
                      } else {
                        if (item?.usernameOrUrl) {
                          let url = item.usernameOrUrl;
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            url = 'https://' + url;
                          }
                          Linking.openURL(url);
                        }
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconCircle}>
                      {getSocialIcon(item.platform)}
                    </View>
                    {isUpdated && (
                      <View style={styles.editBadge}>
                        <Text style={styles.editBadgeText}>✏️</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.noDataText}>Sosyal medya hesabı bulunamadı</Text>
            )}
          </View>

          {/* Save/Cancel Buttons */}
          {isUpdated && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Save size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <X size={20} color="#fff" />
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedPlatform?.displayName} Linki
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              value={linkValue}
              onChangeText={setLinkValue}
              placeholder="https://..."
              placeholderTextColor="#666"
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveLink}>
                <Save size={18} color="#fff" />
                <Text style={styles.modalSaveButtonText}>
                  {editingItem ? 'G\u00fcncelle' : 'Ekle'}
                </Text>
              </TouchableOpacity>

              {editingItem && editingItem.id && (
                <TouchableOpacity style={styles.modalDeleteButton} onPress={handleDeleteLink}>
                  <X size={18} color="#fff" />
                  <Text style={styles.modalDeleteButtonText}>Sil</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
  },
  availablePlatformsContainer: {
    marginBottom: 20,
    backgroundColor: '#10181B',
    borderRadius: 12,
    padding: 16,
  },
  availablePlatformsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7196AC',
    marginBottom: 12,
  },
  availablePlatformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  availablePlatformButton: {
    alignItems: 'center',
    gap: 6,
  },
  smallIconCircle: {
    width: 50,
    height: 50,
    backgroundColor: '#1B272C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availablePlatformText: {
    fontSize: 11,
    color: '#8E8E8E',
    maxWidth: 50,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  iconButton: {
    width: '30%',
    aspectRatio: 1,
  },
  iconCircle: {
    flex: 1,
    backgroundColor: '#1B272C',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#3C616D',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadgeText: {
    fontSize: 12,
  },
  noDataText: {
    fontSize: 16,
    color: '#8E8E8E',
    textAlign: 'center',
    width: '100%',
    marginTop: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#70C094',
    paddingVertical: 15,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1B272C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  modalInput: {
    backgroundColor: '#273034',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalSaveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3C616D',
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalDeleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
