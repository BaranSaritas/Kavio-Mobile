import { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from '../../components/layout/ProfileHeader';
import {
  getMarketingAssetsData,
  resetMarketingAssets,
} from '../../redux/slices/MarketingAssetsSlice';
import { getUserImages } from '../../redux/slices/UserImagesSlice';
import { AppDispatch, RootState } from '../../redux/store';

export default function MarketingAssetsScreen() {
const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSelector((state: RootState) => state.marketingAssets);
  const { user } = useSelector((state: RootState) => state.user);

  const cardId = user?.cardId;

  useEffect(() => {
    if (cardId) {
      dispatch(getMarketingAssetsData({ cardId }));
      dispatch(getUserImages({ cardId }));
    }
  }, [cardId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetMarketingAssets());
    };
  }, [dispatch]);

  const handleCardPress = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Link açılamadı',
        });
      });
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
        {/* Ortak Header */}
        <ProfileHeader />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Kataloglar</Text>
          
          {data && data.length > 0 ? (
            <View style={styles.grid}>
              {data.map((item: any, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.card}
                  onPress={() => handleCardPress(item.url)}
                  activeOpacity={0.8}
                >
                  <View style={styles.imageContainer}>
                    {item.coverPhoto ? (
                      <Image
                        source={{ uri: item.coverPhoto }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>📄</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>Katalog bulunamadı</Text>
          )}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  card: {
    width: '47%',
    backgroundColor: '#1B272C',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 5,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#273034',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#273034',
  },
  placeholderText: {
    fontSize: 48,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 18,
  },
  noDataText: {
    fontSize: 15,
    color: '#8E8E8E',
    textAlign: 'center',
    marginTop: 40,
  },
});
