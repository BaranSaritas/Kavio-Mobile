import { useRouter } from 'expo-router';
import { Bell, Bookmark, ChevronDown, ChevronRight, Edit, LogOut, Menu, MessageCircle, Palette, QrCode, Settings, UserCheck, Users, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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
            <View style={styles.bannerPlaceholder} />
          )}
          
          {/* Hamburger Menu Button */}
          <TouchableOpacity style={styles.menuBtn} onPress={() => setShowMenu(true)}>
            <Menu size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            {profileImg ? (
              <Image source={{ uri: profileImg }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {data?.userInfo?.firstName?.charAt(0)}
                  {data?.userInfo?.lastName?.charAt(0)}
                </Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.iconBtn, isUpdated && styles.iconBtnActive]}
              onPress={handleEditPress}
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
            {data?.userInfo?.firstName} {data?.userInfo?.lastName}
          </Text>
          <Text style={styles.bio}>{data?.userInfo?.bio || 'Full Stack Developer'}</Text>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal visible={showMenu} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.menuModal}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.logo}>KAVIO</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Profile */}
            <View style={styles.modalProfile}>
              {profileImg ? (
                <Image source={{ uri: profileImg }} style={styles.modalAvatar} />
              ) : (
                <View style={styles.modalAvatarPlaceholder}>
                  <Text style={styles.modalAvatarText}>
                    {data?.userInfo?.firstName?.charAt(0)}
                    {data?.userInfo?.lastName?.charAt(0)}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.modalName}>
                  {data?.userInfo?.firstName} {data?.userInfo?.lastName}
                </Text>
                <Text style={styles.modalBio}>{data?.userInfo?.bio || 'Frontend Developer'}</Text>
              </View>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.modalMenu}>
              {menuItems.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={styles.modalMenuItem}
                    onPress={() => {
                      if (item.expandable) {
                        setVisitorsExpanded(!visitorsExpanded);
                      } else if (item.route) {
                        setShowMenu(false);
                        router.push(item.route as any);
                      }
                    }}
                  >
                    <View style={styles.menuItemContent}>
                      <item.icon size={20} color="#fff" />
                      <Text style={styles.modalMenuLabel}>{item.label}</Text>
                    </View>
                    {item.expandable ? (
                      visitorsExpanded ? (
                        <ChevronDown size={20} color="#8E8E8E" />
                      ) : (
                        <ChevronRight size={20} color="#8E8E8E" />
                      )
                    ) : null}
                  </TouchableOpacity>

                  {/* Submenu Items */}
                  {item.expandable && visitorsExpanded && item.children && (
                    <View style={styles.submenu}>
                      {item.children.map((subItem, subIndex) => (
                        <TouchableOpacity
                          key={subIndex}
                          style={styles.submenuItem}
                          onPress={() => {
                            setShowMenu(false);
                            router.push(subItem.route as any);
                          }}
                        >
                          <View style={styles.submenuContent}>
                            <subItem.icon size={18} color="#D4D4D4" />
                            <Text style={styles.submenuLabel}>{subItem.label}</Text>
                          </View>
                          <ChevronRight size={18} color="#8E8E8E" />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={20} color="#fff" />
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
  bannerPlaceholder: { width: '100%', height: '100%', backgroundColor: '#273034' },
  menuBtn: { position: 'absolute', left: 15, top: 15, backgroundColor: '#1c1f24', padding: 8, borderRadius: 10, zIndex: 10 },
  avatarWrapper: { position: 'absolute', bottom: -45, left: 24, borderRadius: 100, borderWidth: 3, borderColor: '#141e22', overflow: 'hidden' },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#3C616D', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  actions: { position: 'absolute', right: 15, bottom: 15, flexDirection: 'row', gap: 8 },
  iconBtn: { backgroundColor: '#1c1f24', padding: 8, borderRadius: 10 },
  iconBtnActive: { backgroundColor: '#3C616D' },
  userInfo: { marginTop: 60, paddingHorizontal: 24, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: '700', color: '#fff' },
  bio: { fontSize: 15, color: '#A2A2A2', marginTop: 4 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuModal: { flex: 1, backgroundColor: '#5A7E8C', paddingTop: 60, paddingHorizontal: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  logo: { fontSize: 24, fontWeight: '700', color: '#E8D9C5', letterSpacing: 2 },
  modalProfile: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30 },
  modalAvatar: { width: 60, height: 60, borderRadius: 30 },
  modalAvatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#3C616D', justifyContent: 'center', alignItems: 'center' },
  modalAvatarText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  modalName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  modalBio: { fontSize: 14, color: '#D4D4D4', marginTop: 2 },
  modalMenu: { flex: 1 },
  modalMenuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  menuItemContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  modalMenuLabel: { fontSize: 16, fontWeight: '500', color: '#fff' },
  submenu: { backgroundColor: 'rgba(0,0,0,0.2)', paddingLeft: 20 },
  submenuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  submenuContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  submenuLabel: { fontSize: 15, fontWeight: '500', color: '#D4D4D4' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#CD6060', paddingVertical: 15, borderRadius: 10, marginBottom: 30 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
