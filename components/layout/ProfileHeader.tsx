import { Edit, QrCode } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUpdatedPage } from '../../redux/slices/UpdatePageSlice';
import { RootState } from '../../redux/store';
import { updatePageChecker } from '../../utils/helpers';

interface ProfileHeaderProps {
  currentPage?: string;
}


export default function ProfileHeader({ currentPage }: ProfileHeaderProps) {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.profile);
  const { bannerImg, profileImg } = useSelector((state: RootState) => state.userImages);
  const { updatedPage } = useSelector((state: RootState) => state.updatePage);

  const isUpdated = updatePageChecker(currentPage ?? "", updatedPage ?? "");

  const handleEditPress = () => {
    if (isUpdated) {
      // Edit moddan çık
      dispatch(setUpdatedPage(null));
    } else {
      // Edit moda gir
      dispatch(setUpdatedPage(currentPage));
    }
  };

  return (
    <View style={styles.header}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        {bannerImg ? (
          <Image
            source={{ uri: bannerImg }}
            style={styles.banner}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.bannerPlaceholder} />
        )}
        
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          {profileImg ? (
            <Image
              source={{ uri: profileImg }}
              style={styles.avatar}
            />
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
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  bannerContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#273034',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -45,
    left: 24,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#141e22',
    overflow: 'hidden',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#3C616D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  actions: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    backgroundColor: '#1c1f24',
    padding: 8,
    borderRadius: 10,
  },
  iconBtnActive: {
    backgroundColor: '#3C616D',
  },
  userInfo: {
    marginTop: 60,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  bio: {
    fontSize: 15,
    color: '#A2A2A2',
    marginTop: 4,
  },
});
