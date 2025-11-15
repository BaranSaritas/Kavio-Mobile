import {
  Check,
  Edit,
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Plus,
  Trash2,
  Twitter,
  X,
  Youtube,
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
  updateSocialMedia
} from '../../redux/slices/SocialMediaSlice';
import { getUserImages } from '../../redux/slices/UserImagesSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { updatePageChecker } from '../../utils/helpers';

const CURRENT_PAGE = '/(tabs)/social-media';

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
    default:
      return <Instagram {...iconProps} />;
  }
};

export default function SocialMediaScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, socialMediaPlatforms, isLoading } = useSelector(
    (state: RootState) => state.socialMedia
  );
  const { updatedPage } = useSelector((state: RootState) => state.updatePage);
  const { user } = useSelector((state: RootState) => state.user);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [platformLinks, setPlatformLinks] = useState<any[]>([]);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [editValue, setEditValue] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newLink, setNewLink] = useState('');

  const cardId = user?.cardId;
  const isUpdated = updatePageChecker(CURRENT_PAGE, updatedPage);

  useEffect(() => {
    if (cardId) {
      dispatch(getSocialMediaData({ cardId }));
      dispatch(getSocialMediaPlatformsData({}));
      dispatch(getUserImages({ cardId }));
    }
  }, [cardId, dispatch]);

  // Update platformLinks when data changes and modal is open
  useEffect(() => {
    if (showModal && selectedPlatform && data) {
      const updatedLinks = data.filter((d: any) => d.platform === selectedPlatform.name);
      setPlatformLinks(updatedLinks);
    }
  }, [data, showModal, selectedPlatform]);

  // Group platforms by name
  const groupedPlatforms = socialMediaPlatforms?.reduce((acc: any, platform: any) => {
    const platformData = data?.filter((d: any) => d.platform === platform.name);
    if (platformData && platformData.length > 0) {
      acc.push({
        ...platform,
        links: platformData,
      });
    }
    return acc;
  }, []);

  const availablePlatforms = socialMediaPlatforms?.filter((platform: any) =>
    !data?.some((d: any) => d.platform === platform.name)
  );

  const handlePlatformPress = (platform: any) => {
    setSelectedPlatform(platform);
    setPlatformLinks(platform.links || []);
    setShowModal(true);
    setAddingNew(false);
    setEditingLink(null);
  };

  const handleAddNew = () => {
    if (platformLinks.length >= 3) {
      Toast.show({
        type: 'error',
        text1: 'En fazla 3 hesap eklenebilir',
      });
      return;
    }
    setAddingNew(true);
    setNewLink('');
  };

  const handleSaveNew = async () => {
    if (!newLink.trim()) {
      Toast.show({ type: 'error', text1: 'Link boş olamaz' });
      return;
    }

    const newData = [
      ...data,
      {
        platform: selectedPlatform.name,
        usernameOrUrl: newLink,
        cardId,
      },
    ];

    const res = await dispatch(updateSocialMedia({ cardId, updatedData: newData }));
    if (res?.meta?.requestStatus === 'fulfilled') {
      await dispatch(getSocialMediaData({ cardId }));
      await dispatch(getSocialMediaPlatformsData({}));
      setNewLink('');
      setAddingNew(false);
      Toast.show({ type: 'success', text1: 'Eklendi' });
      // ✅ Modal açık kalsın, state güncellendi
    }
  };

  const handleEdit = (link: any) => {
    setEditingLink(link);
    setEditValue(link.usernameOrUrl);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      Toast.show({ type: 'error', text1: 'Link boş olamaz' });
      return;
    }

    const newData = data.map((item: any) =>
      item.id === editingLink.id ? { ...item, usernameOrUrl: editValue } : item
    );

    const res = await dispatch(updateSocialMedia({ cardId, updatedData: newData }));
    if (res?.meta?.requestStatus === 'fulfilled') {
      await dispatch(getSocialMediaData({ cardId }));
      await dispatch(getSocialMediaPlatformsData({}));
      setEditingLink(null);
      setEditValue('');
      Toast.show({ type: 'success', text1: 'Güncellendi' });
      // ✅ Modal açık kalsın, state güncellendi
    }
  };

  const handleDelete = async (linkId: number) => {
    const newData = data.filter((item: any) => item.id !== linkId);
    const res = await dispatch(updateSocialMedia({ cardId, updatedData: newData }));
    if (res?.meta?.requestStatus === 'fulfilled') {
      await dispatch(getSocialMediaData({ cardId }));
      await dispatch(getSocialMediaPlatformsData({}));
      
      // If no more links for this platform, close modal
      const remainingLinks = newData.filter((item: any) => item.platform === selectedPlatform.name);
      if (remainingLinks.length === 0) {
        setShowModal(false);
        setSelectedPlatform(null);
      }
      // ✅ Else modal açık kalsın, state güncellendi
      
      Toast.show({ type: 'success', text1: 'Silindi' });
    }
  };

  const handleAddPlatform = async (platform: any) => {
    setSelectedPlatform(platform);
    setPlatformLinks([]);
    setAddingNew(true);
    setNewLink('');
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
        <ProfileHeader currentPage={CURRENT_PAGE} />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Sosyal Medya</Text>
          
          {/* Available Platforms to Add */}
          {isUpdated && availablePlatforms && availablePlatforms.length > 0 && (
            <View style={styles.addSection}>
              <Text style={styles.addTitle}>Platform Ekle</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.addGrid}>
                  {availablePlatforms.map((platform: any, idx: number) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.addButton}
                      onPress={() => handleAddPlatform(platform)}
                    >
                      <Plus size={20} color="#7196AC" />
                      <Text style={styles.addButtonText}>{platform.displayName}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
          
          {/* Existing Platforms */}
          <View style={styles.grid}>
            {groupedPlatforms && groupedPlatforms.length > 0 ? (
              groupedPlatforms.map((platform: any, idx: number) => (
                <View key={idx} style={styles.iconWrapper}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handlePlatformPress(platform)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconCircle}>
                      {getSocialIcon(platform.name)}
                      {isUpdated && (
                        <View style={styles.editBadge}>
                          <Edit size={16} color="#fff" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  {platform.links.length > 1 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{platform.links.length}</Text>
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
                {selectedPlatform && getSocialIcon(selectedPlatform.name, 28)}
                <Text style={styles.modalTitle}>{selectedPlatform?.displayName}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setSelectedPlatform(null);
                  setAddingNew(false);
                  setEditingLink(null);
                  setNewLink('');
                  setEditValue('');
                }}
              >
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Add Button (Edit Mode) */}
            {isUpdated && !addingNew && platformLinks.length < 3 && (
              <TouchableOpacity style={styles.addNewBtn} onPress={handleAddNew}>
                <Plus size={20} color="#7196AC" />
                <Text style={styles.addNewText}>Yeni Hesap Ekle</Text>
              </TouchableOpacity>
            )}

            {/* Adding New */}
            {addingNew && (
              <View style={styles.linkItem}>
                <TextInput
                  style={styles.linkInput}
                  value={newLink}
                  onChangeText={setNewLink}
                  placeholder="https://..."
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                  autoFocus
                />
                <TouchableOpacity style={styles.iconBtn} onPress={handleSaveNew}>
                  <Check size={20} color="#70C094" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => {
                    setAddingNew(false);
                    setNewLink('');
                  }}
                >
                  <X size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            )}

            {/* Links List */}
            <ScrollView style={styles.linksList}>
              {platformLinks && platformLinks.length > 0 ? (
                platformLinks.map((link: any, idx: number) => (
                  <View key={link.id || idx} style={styles.linkItem}>
                    {editingLink?.id === link.id ? (
                      <>
                        <TextInput
                          style={styles.linkInput}
                          value={editValue}
                          onChangeText={setEditValue}
                          autoCapitalize="none"
                          autoFocus
                        />
                        <TouchableOpacity style={styles.iconBtn} onPress={handleSaveEdit}>
                          <Check size={20} color="#70C094" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconBtn}
                          onPress={() => {
                            setEditingLink(null);
                            setEditValue('');
                          }}
                        >
                          <X size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.linkTextWrapper}
                          onPress={() => !isUpdated && Linking.openURL(link.usernameOrUrl)}
                          disabled={isUpdated}
                        >
                          <Text style={styles.linkText} numberOfLines={1}>
                            {link.usernameOrUrl}
                          </Text>
                          {!isUpdated && <ExternalLink size={16} color="#7196AC" />}
                        </TouchableOpacity>
                        {isUpdated && (
                          <>
                            <TouchableOpacity
                              style={styles.iconBtn}
                              onPress={() => handleEdit(link)}
                            >
                              <Edit size={20} color="#7196AC" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.iconBtn}
                              onPress={() => handleDelete(link.id)}
                            >
                              <Trash2 size={20} color="#ff6b6b" />
                            </TouchableOpacity>
                          </>
                        )}
                      </>
                    )}
                  </View>
                ))
              ) : (
                !addingNew && (
                  <Text style={styles.noLinksText}>Link bulunamadı</Text>
                )
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
  addSection: { marginBottom: 20 },
  addTitle: { fontSize: 14, fontWeight: '600', color: '#8E8E8E', marginBottom: 10 },
  addGrid: { flexDirection: 'row', gap: 10 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10181B', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#7196AC' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  iconWrapper: { width: '30%', position: 'relative' },
  iconButton: { aspectRatio: 1 },
  iconCircle: { flex: 1, backgroundColor: '#1B272C', borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  editBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#3C616D', padding: 4, borderRadius: 12 },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#70C094', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  noDataText: { fontSize: 16, color: '#8E8E8E', textAlign: 'center', width: '100%', marginTop: 40 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1B272C', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalPlatform: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  addNewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#273034', paddingVertical: 12, borderRadius: 8, marginBottom: 15 },
  addNewText: { fontSize: 14, fontWeight: '600', color: '#7196AC' },
  linksList: { maxHeight: 400 },
  linkItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#273034', padding: 12, borderRadius: 8, marginBottom: 10 },
  linkTextWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  linkText: { fontSize: 15, color: '#fff', flex: 1 },
  linkInput: { flex: 1, backgroundColor: '#1B272C', color: '#fff', fontSize: 15, padding: 12, borderRadius: 8 },
  iconBtn: { padding: 4 },
  noLinksText: { fontSize: 15, color: '#8E8E8E', textAlign: 'center', marginTop: 20 },
});
