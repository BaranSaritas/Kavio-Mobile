import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import {
  Bell,
  Bookmark,
  Users,
  Palette,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { logout } from '../../redux/slices/UserSlice';
import { RootState } from '../../redux/store';

export default function DrawerContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data } = useSelector((state: RootState) => state.profile);
  const { profileImg } = useSelector((state: RootState) => state.userImages);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  const menuItems = [
    { icon: Bell, label: 'Notice', route: '/notifications' },
    { icon: Bookmark, label: 'Saves', route: '/saves' },
    { icon: Users, label: 'Visitors', route: '/visitors' },
    { icon: Palette, label: 'Themes', route: '/themes' },
    { icon: Settings, label: 'Settings', route: '/settings' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>KAVIO</Text>
        
        {/* Profile */}
        <View style={styles.profile}>
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
          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {data?.userInfo?.firstName} {data?.userInfo?.lastName}
            </Text>
            <Text style={styles.bio}>{data?.userInfo?.bio || 'Frontend Developer'}</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <item.icon size={20} color="#fff" />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <ChevronRight size={20} color="#8E8E8E" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <LogOut size={20} color="#fff" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5A7E8C',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E8D9C5',
    letterSpacing: 2,
    marginBottom: 30,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3C616D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  bio: {
    fontSize: 14,
    color: '#D4D4D4',
    marginTop: 2,
  },
  menu: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#CD6060',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
