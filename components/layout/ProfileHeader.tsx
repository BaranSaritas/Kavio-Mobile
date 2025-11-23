import { useRouter } from 'expo-router';
import { Bell, Bookmark, ChevronDown, ChevronRight, Edit, LogOut, Menu, MessageCircle, Palette, QrCode, Settings, UserCheck, Users, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { setUpdatedPage } from '../../redux/slices/UpdatePageSlice';
import { logout } from '../../redux/slices/UserSlice';
import { RootState } from '../../redux/store';
import { updatePageChecker } from '../../utils/helpers';

interface ProfileHeaderProps {
  currentPage: string;
}

export default function ProfileHeader({ currentPage }: ProfileHeaderProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { data } = useSelector((state: RootState) => state.profile);
  const { bannerImg, profileImg } = useSelector((state: RootState) => state.userImages);
  const { updatedPage } = useSelector((state: RootState) => state.updatePage);

  const [showMenu, setShowMenu] = useState(false);
  const [visitorsExpanded, setVisitorsExpanded] = useState(false);

  const isUpdated = updatePageChecker(currentPage, updatedPage);

  const handleEditPress = () => {
    if (isUpdated) {
      dispatch(setUpdatedPage(null));
    } else {
      dispatch(setUpdatedPage(currentPage));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowMenu(false);
    router.replace('/(auth)/login');
  };

  const menuItems = [
    { icon: Bell, label: 'Notice', route: '/notifications' },
    { icon: Bookmark, label: 'Saves', route: '/saves' },
    {
      icon: Users,
      label: 'Visitors',
      expandable: true,
      children: [
        { icon: MessageCircle, label: 'Contacts', route: '/visitors/contacts' },
        { icon: UserCheck, label: 'Connections', route: '/visitors/connections' },
      ]
    },
    { icon: Palette, label: 'Themes', route: '/themes' },
    { icon: Settings, label: 'Settings', route: '/settings' },
  ];

  return (
    <>
      <View style={styles.header}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          {bannerImg ? (
            <Image source={{ uri: bannerImg }} style={styles.banner} resizeMode="cover" />
          ) : (
            <View style={[styles.bannerPlaceholder, { backgroundColor: theme.headerBackgroundColor }]} />
          )}
          
          {/* Hamburger Menu Button - Safe Area ile */}
          <TouchableOpacity 
            style={[
              styles.menuBtn, 
              { 
                backgroundColor: theme.menuBackgroundColor, 
                top: insets.top + 15 
              }
            ]} 
            onPress={() => setShowMenu(true)}
          >
            <Menu size={24} color={theme.textColor} />
          </TouchableOpacity>
          
          {/* Avatar */}
          <View style={[styles.avatarWrapper, { borderColor: theme.backgroundColor }]}>
            {profileImg ? (
              <Image source={{ uri: profileImg }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primaryColor }]}>
                <Text style={[styles.avatarText, { color: theme.textColor }]}>
                  {data?.userInfo?.firstName?.charAt(0)}
                  {data?.userInfo?.lastName?.charAt(0)}
                </Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.iconBtn, 
                { backgroundColor: theme.menuBackgroundColor },
                isUpdated && { backgroundColor: theme.primaryColor }
              ]}
              onPress={handleEditPress}
            >
              <Edit size={20} color={theme.textColor} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.menuBackgroundColor }]}>
              <QrCode size={20} color={theme.textColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: theme.textColor }]}>
            {data?.userInfo?.firstName} {data?.userInfo?.lastName}
          </Text>
          <Text style={[styles.bio, { color: theme.jobColor }]}>{data?.userInfo?.bio || 'Full Stack Developer'}</Text>
        </View>
      </View>

      {/* Menu Modal - Full Screen */}
      <Modal visible={showMenu} transparent animationType="slide">
        <View style={[styles.menuModal, { backgroundColor: theme.menuBackgroundColor }]}>
          {/* Header with Safe Area */}
          <View style={[styles.modalHeader, { paddingTop: insets.top + 16 }]}>
            <Text style={[styles.logo, { color: theme.primaryColor }]}>KAVIO</Text>
            <TouchableOpacity 
              onPress={() => setShowMenu(false)}
              style={styles.closeButton}
            >
              <X size={28} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          {/* Profile */}
          <View style={styles.modalProfile}>
            {profileImg ? (
              <Image source={{ uri: profileImg }} style={styles.modalAvatar} />
            ) : (
              <View style={[styles.modalAvatarPlaceholder, { backgroundColor: theme.primaryColor }]}>
                <Text style={[styles.modalAvatarText, { color: theme.textColor }]}>
                  {data?.userInfo?.firstName?.charAt(0)}
                  {data?.userInfo?.lastName?.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.modalProfileInfo}>
              <Text style={[styles.modalName, { color: theme.textColor }]}>
                {data?.userInfo?.firstName} {data?.userInfo?.lastName}
              </Text>
              <Text style={[styles.modalBio, { color: theme.labelColor }]}>
                {data?.userInfo?.bio || 'Frontend Developer'}
              </Text>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView 
            style={styles.modalMenu} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalMenuContent}
          >
            {menuItems.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={[
                    styles.modalMenuItem,
                    { borderBottomColor: theme.activeMenuBackgroundColor }
                  ]}
                  onPress={() => {
                    if (item.expandable) {
                      setVisitorsExpanded(!visitorsExpanded);
                    } else if (item.route) {
                      setShowMenu(false);
                      router.push(item.route as any);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.activeMenuBackgroundColor }]}>
                      <item.icon size={22} color={theme.activeMenuColor} />
                    </View>
                    <Text style={[styles.modalMenuLabel, { color: theme.textColor }]}>{item.label}</Text>
                  </View>
                  {item.expandable ? (
                    visitorsExpanded ? (
                      <ChevronDown size={22} color={theme.labelColor} />
                    ) : (
                      <ChevronRight size={22} color={theme.labelColor} />
                    )
                  ) : (
                    <ChevronRight size={22} color={theme.labelColor} />
                  )}
                </TouchableOpacity>

                {/* Submenu Items */}
                {item.expandable && visitorsExpanded && item.children && (
                  <View style={[styles.submenu, { backgroundColor: theme.activeMenuBackgroundColor }]}>
                    {item.children.map((subItem, subIndex) => (
                      <TouchableOpacity
                        key={subIndex}
                        style={[
                          styles.submenuItem,
                          { borderBottomColor: theme.menuBackgroundColor }
                        ]}
                        onPress={() => {
                          setShowMenu(false);
                          router.push(subItem.route as any);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.submenuContent}>
                          <View style={[styles.submenuIconContainer, { backgroundColor: theme.menuBackgroundColor }]}>
                            <subItem.icon size={18} color={theme.activeMenuColor} />
                          </View>
                          <Text style={[styles.submenuLabel, { color: theme.textColor }]}>{subItem.label}</Text>
                        </View>
                        <ChevronRight size={18} color={theme.labelColor} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Logout - with Safe Area Bottom */}
          <View style={{ paddingBottom: insets.bottom + 16 }}>
            <TouchableOpacity 
              style={[styles.logoutBtn, { backgroundColor: '#DC3545' }]} 
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <LogOut size={22} color="#fff" />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  bannerContainer: { position: 'relative', width: '100%', height: 200 },
  banner: { width: '100%', height: '100%' },
  bannerPlaceholder: { width: '100%', height: '100%' },
  menuBtn: { 
    position: 'absolute', 
    left: 15, 
    padding: 10, 
    borderRadius: 12, 
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatarWrapper: { 
    position: 'absolute', 
    bottom: -45, 
    left: 24, 
    borderRadius: 100, 
    borderWidth: 4, 
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarText: { fontSize: 32, fontWeight: '700' },
  actions: { position: 'absolute', right: 15, bottom: 15, flexDirection: 'row', gap: 10 },
  iconBtn: { 
    padding: 10, 
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  userInfo: { marginTop: 60, paddingHorizontal: 24, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: '700' },
  bio: { fontSize: 15, marginTop: 4 },

  // Modal - Full Screen
  menuModal: { 
    flex: 1,
    paddingHorizontal: 20
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24,
  },
  logo: { 
    fontSize: 28, 
    fontWeight: '800', 
    letterSpacing: 3
  },
  closeButton: {
    padding: 4,
  },
  modalProfile: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  modalAvatar: { 
    width: 64, 
    height: 64, 
    borderRadius: 32,
    elevation: 3,
  },
  modalAvatarPlaceholder: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 3,
  },
  modalAvatarText: { 
    fontSize: 22, 
    fontWeight: '700'
  },
  modalProfileInfo: {
    flex: 1
  },
  modalName: { 
    fontSize: 18, 
    fontWeight: '700',
    marginBottom: 4
  },
  modalBio: { 
    fontSize: 14
  },
  modalMenu: { 
    flex: 1
  },
  modalMenuContent: {
    paddingBottom: 20,
  },
  modalMenuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  menuItemContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 14,
    flex: 1
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalMenuLabel: { 
    fontSize: 16, 
    fontWeight: '600'
  },
  submenu: { 
    paddingLeft: 16,
    paddingRight: 8
  },
  submenuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 14, 
    paddingHorizontal: 12,
    borderBottomWidth: 1
  },
  submenuContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12,
    flex: 1
  },
  submenuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submenuLabel: { 
    fontSize: 15, 
    fontWeight: '500'
  },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12,
    paddingVertical: 16, 
    borderRadius: 14,
    marginTop: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutText: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#fff'
  },
});
