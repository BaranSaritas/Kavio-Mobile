import * as Clipboard from 'expo-clipboard';
import { Check, Copy, Link as LinkIcon, Mail, MapPin, MessageCircle, Phone, Plus, Printer, Save, Trash2, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from '../../components/layout/ProfileHeader';
import { useTheme } from '../../hooks/useTheme';
import {
  getProfileData,
  setProfileData,
  updateProfileData
} from '../../redux/slices/ProfileSlice';
import { setUpdatedPage } from '../../redux/slices/UpdatePageSlice';
import { getUserImages } from '../../redux/slices/UserImagesSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { linkData, updatePageChecker } from '../../utils/helpers';

const CURRENT_PAGE = '/(tabs)/profile';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data, isLoading } = useSelector((state: RootState) => state.profile);
  const { updatedPage } = useSelector((state: RootState) => state.updatePage);
  const { user } = useSelector((state: RootState) => state.user);
  const [copied, setCopied] = useState<number | null>(null);

  // Debug: tema değişikliklerini izle
  // useEffect(() => {
  //   console.log('Profile - Current theme:', theme.backgroundColor, theme.textColor);
  // }, [theme]);

  const cardId = user?.cardId;
  const isUpdated = updatePageChecker(CURRENT_PAGE, updatedPage);

  useEffect(() => {
    if (cardId) {
      dispatch(getProfileData({ cardId }));
      dispatch(getUserImages({ cardId }));
    }
  }, [cardId, dispatch]);

  const handleCopy = async (id: number, text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(id);
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
    if (isUpdated) return;
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
    const iconProps = { size: 18, color: theme.activeMenuColor };
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

  // Edit Mode Functions
  const handleContactInfoChange = (idx: number, value: string) => {
    const updated = data?.contactInfos?.map((item: any, i: number) =>
      i === idx ? { ...item, value } : item
    );
    dispatch(setProfileData({ ...data, contactInfos: updated }));
  };

  const handleAddContactInfo = (contactType: string) => {
    dispatch(
      setProfileData({
        ...data,
        contactInfos: [
          ...(Array.isArray(data?.contactInfos) ? data.contactInfos : []),
          { contactType, value: '' },
        ],
      })
    );
  };

  const handleDeleteContactInfo = (index: number) => {
    const updatedContactInfos = (data?.contactInfos || []).filter(
      (_: any, i: number) => i !== index
    );
    dispatch(setProfileData({ ...data, contactInfos: updatedContactInfos }));
  };

  const handleAddLink = () => {
    dispatch(
      setProfileData({
        ...data,
        links: [
          ...(data?.links || []),
          {
            position: (data?.links?.length || 0) + 1,
            title: 'UNKNOWN',
            value: '',
          },
        ],
      })
    );
  };

  const handleLinkChange = (idx: number, value: string) => {
    const updatedLinks = [...(data?.links || [])].map((link: any, index: number) =>
      index === idx ? { ...link, value } : link
    );
    dispatch(setProfileData({ ...data, links: updatedLinks }));
  };

  const handleDeleteLink = (id: number) => {
    const updatedLinks = (data?.links || []).filter((el: any) => el.id !== id);
    dispatch(setProfileData({ ...data, links: updatedLinks }));
  };

  const handleSave = async () => {
    const res = await dispatch(updateProfileData(data));
    if (res?.meta?.requestStatus === 'fulfilled') {
      dispatch(getProfileData({ cardId }));
      dispatch(setUpdatedPage(null));
      Toast.show({
        type: 'success',
        text1: 'Kaydedildi',
      });
    }
  };

  const handleCancel = () => {
    dispatch(getProfileData({ cardId }));
    dispatch(setUpdatedPage(null));
  };

  if (isLoading && !data) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.activeMenuColor} />
      </View>
    );
  }

  const tabBarHeight = Platform.OS === 'ios' ? 75 + insets.bottom : 75;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 30
        }}
      >
        <ProfileHeader currentPage={CURRENT_PAGE} />

        <View style={styles.content}>
          {/* Contact Infos */}
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>İletişim Bilgileri</Text>

          {isUpdated && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.addButtonsContainer}
              contentContainerStyle={styles.addButtonsContent}
            >
              {linkData?.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.addButton, { backgroundColor: theme.activeMenuBackgroundColor }]}
                  onPress={() => handleAddContactInfo(item?.contactType)}
                >
                  <Text style={[styles.addButtonText, { color: theme.activeMenuColor }]}>{item?.value}</Text>
                  <Plus size={16} color={theme.activeMenuColor} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={styles.section}>
            {data?.contactInfos && data.contactInfos.length > 0 ? (
              data.contactInfos.map((item: any, idx: number) => (
                <View key={idx} style={styles.contactItemWrapper}>
                  {isUpdated ? (
                    <View style={styles.editRow}>
                      <View style={[styles.editInputWrapper, { backgroundColor: theme.headerBackgroundColor }]}>
                        {getContactIcon(item.contactType)}
                        <TextInput
                          style={[styles.editInput, { color: theme.textColor }]}
                          value={item?.value || ''}
                          onChangeText={(text) => handleContactInfoChange(idx, text)}
                          placeholder="Değer girin"
                          placeholderTextColor={theme.labelColor}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteContactInfo(idx)}
                      >
                        <Trash2 size={20} color="#ff6b6b" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.contactItem, { backgroundColor: theme.menuBackgroundColor }]}
                      onPress={() => handleContactPress(item.contactType, item.value)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.contactLeft}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.headerBackgroundColor }]}>
                          {getContactIcon(item.contactType)}
                        </View>
                        <Text style={[styles.contactText, { color: theme.textColor }]}>{item.value}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCopy(item.id, item.value);
                        }}
                      >
                        {copied === item.id ? (
                          <Check size={18} color={theme.submitButtonBackgroundColor} />
                        ) : (
                          <Copy size={18} color={theme.labelColor} />
                        )}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            ) : (
              <Text style={[styles.noDataText, { color: theme.labelColor }]}>İletişim bilgisi bulunamadı</Text>
            )}
          </View>

          {/* Links */}
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Linkler</Text>

          {isUpdated && (
            <TouchableOpacity 
              style={[styles.addButtonFull, { backgroundColor: theme.activeMenuBackgroundColor }]} 
              onPress={handleAddLink}
            >
              <Text style={[styles.addButtonText, { color: theme.activeMenuColor }]}>Link Ekle</Text>
              <Plus size={16} color={theme.activeMenuColor} />
            </TouchableOpacity>
          )}

          <View style={styles.section}>
            {data?.links && data.links.length > 0 ? (
              [...(data?.links ?? [])] 
                .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
                .map((item: any, idx: number) => (
                  <View key={idx} style={styles.contactItemWrapper}>
                    {isUpdated ? (
                      <View style={styles.editRow}>
                        <View style={[styles.editInputWrapper, { backgroundColor: theme.headerBackgroundColor }]}>
                          <LinkIcon size={18} color={theme.activeMenuColor} />
                          <TextInput
                            style={[styles.editInput, { color: theme.textColor }]}
                            value={item?.value || ''}
                            onChangeText={(text) => handleLinkChange(idx, text)}
                            placeholder="Link girin"
                            placeholderTextColor={theme.labelColor}
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => handleDeleteLink(item.id)}
                        >
                          <Trash2 size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.contactItem, { backgroundColor: theme.menuBackgroundColor }]}
                        onPress={() => Linking.openURL(item.value)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.contactLeft}>
                          <View style={[styles.iconCircle, { backgroundColor: theme.headerBackgroundColor }]}>
                            <LinkIcon size={18} color={theme.activeMenuColor} />
                          </View>
                          <Text style={[styles.contactText, { color: theme.textColor }]}>{item.value}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.copyBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleCopy(item.id, item.value);
                          }}
                        >
                          {copied === item.id ? (
                            <Check size={18} color={theme.submitButtonBackgroundColor} />
                          ) : (
                            <Copy size={18} color={theme.labelColor} />
                          )}
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
            ) : (
              <Text style={[styles.noDataText, { color: theme.labelColor }]}>Link bulunamadı</Text>
            )}
          </View>

          {/* Save/Cancel Buttons */}
          {isUpdated && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.submitButtonBackgroundColor }]} 
                onPress={handleSave}
              >
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  addButtonsContainer: {
    marginBottom: 12,
  },
  addButtonsContent: {
    gap: 10,
    paddingRight: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contactItemWrapper: {
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 15,
    flex: 1,
  },
  copyBtn: {
    padding: 8,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
  editInput: {
    flex: 1,
    fontSize: 16,
  },
  deleteBtn: {
    padding: 8,
  },
  noDataText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
});
