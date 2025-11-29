import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { getAllThemes, updateCardTheme } from '../../redux/slices/ThemeSlice';
import { updateUserSettingTheme } from '../../redux/slices/UserSlice';
import { AppDispatch, RootState } from '../../redux/store';
import Axios from '../../api/axiosInstance';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function ThemesScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  
  const { themes, isLoading, isUpdating } = useSelector((state: RootState) => state.theme);
  const { user } = useSelector((state: RootState) => state.user);
  const cardId = user?.cardId;
  
  const currentThemeName = user?.card?.setting?.theme || 'default';
  
  // Detaylı tema bilgileri
  const [detailedThemes, setDetailedThemes] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const topPadding = Platform.OS === 'android' 
    ? (StatusBar.currentHeight || 0) + 10 
    : insets.top;

  // Tema listesi geldiğinde detayları çek
  useEffect(() => {
    const controller = new AbortController();
    dispatch(getAllThemes({ signal: controller.signal }));
    return () => controller.abort();
  }, [dispatch]);

  // Tema listesi geldiğinde her birinin detayını çek
  useEffect(() => {
    if (themes && themes.length > 0) {
      fetchAllThemeDetails();
    }
  }, [themes]);

  const fetchAllThemeDetails = async () => {
    if (!themes || themes.length === 0) return;
    
    setLoadingDetails(true);
    try {
      const detailPromises = themes.map((t: any) => 
        Axios.get(`/themes/${t.id}`).then(res => res.data).catch(() => t)
      );
      const results = await Promise.all(detailPromises);
      setDetailedThemes(results);
    } catch (error) {
      console.log('Error fetching theme details:', error);
      setDetailedThemes(themes);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectTheme = async (selectedTheme: any) => {
    if (!cardId || selectedTheme.name === currentThemeName) return;
    
    try {
      // API'ye tema güncelleme isteği at + state'i güncelle
      await dispatch(updateCardTheme({ 
        cardId, 
        themeName: selectedTheme.name,
        themeData: selectedTheme 
      })).unwrap();
      
      dispatch(updateUserSettingTheme(selectedTheme.name));
      
      Toast.show({
        type: 'success',
        text1: 'Tema Güncellendi',
        text2: `${formatThemeName(selectedTheme.name)} teması uygulandı`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Tema güncellenirken bir hata oluştu',
      });
    }
  };

  const formatThemeName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderThemeCard = (item: any) => {
    const isSelected = currentThemeName === item.name;
    
    // Tema renkleri (API'den gelen gerçek renkler)
    const bgColor = item.backgroundColor || '#1a1a2e';
    const headerBg = item.headerBackgroundColor || '#16213e';
    const menuBg = item.menuBackgroundColor || '#0f3460';
    const primaryClr = item.primaryColor || '#e94560';
    const textClr = item.textColor || '#ffffff';
    const activeClr = item.activeMenuColor || '#e94560';
    const labelClr = item.labelColor || '#888888';
    const activeBg = item.activeMenuBackgroundColor || '#1a1a2e';
    const submitBg = item.submitButtonBackgroundColor || primaryClr;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.themeCard,
          { 
            backgroundColor: menuBg,
            borderColor: isSelected ? primaryClr : 'transparent',
            borderWidth: isSelected ? 2 : 0,
          }
        ]}
        onPress={() => handleSelectTheme(item)}
        activeOpacity={0.8}
        disabled={isUpdating}
      >
        {/* Mini Phone Preview */}
        <View style={[styles.phoneFrame, { backgroundColor: bgColor }]}>
          {/* Status Bar */}
          <View style={[styles.phoneStatusBar, { backgroundColor: headerBg }]}>
            <View style={styles.statusBarDots}>
              <View style={[styles.statusDot, { backgroundColor: activeClr }]} />
              <View style={[styles.statusDot, { backgroundColor: activeClr, opacity: 0.6 }]} />
              <View style={[styles.statusDot, { backgroundColor: activeClr, opacity: 0.3 }]} />
            </View>
          </View>
          
          {/* Header Area */}
          <View style={[styles.phoneHeader, { backgroundColor: headerBg }]}>
            <View style={[styles.avatarCircle, { backgroundColor: primaryClr }]} />
            <View style={styles.headerLines}>
              <View style={[styles.headerLine, { backgroundColor: textClr, width: '70%' }]} />
              <View style={[styles.headerLine, { backgroundColor: labelClr, width: '50%' }]} />
            </View>
          </View>
          
          {/* Content Area */}
          <View style={styles.phoneContent}>
            <View style={[styles.contentCard, { backgroundColor: activeBg }]}>
              <View style={[styles.cardIcon, { backgroundColor: activeClr }]} />
              <View style={[styles.cardLines]}>
                <View style={[styles.cardLine, { backgroundColor: textClr, width: '80%' }]} />
                <View style={[styles.cardLine, { backgroundColor: labelClr, width: '60%' }]} />
              </View>
            </View>
            <View style={[styles.contentCard, { backgroundColor: activeBg }]}>
              <View style={[styles.cardIcon, { backgroundColor: activeClr }]} />
              <View style={[styles.cardLines]}>
                <View style={[styles.cardLine, { backgroundColor: textClr, width: '75%' }]} />
                <View style={[styles.cardLine, { backgroundColor: labelClr, width: '55%' }]} />
              </View>
            </View>
          </View>
          
          {/* Bottom Button */}
          <View style={styles.phoneBottom}>
            <View style={[styles.bottomButton, { backgroundColor: submitBg }]} />
          </View>
        </View>

        {/* Theme Name & Colors */}
        <View style={styles.themeInfo}>
          <Text style={[styles.themeName, { color: textClr }]} numberOfLines={1}>
            {formatThemeName(item.name)}
          </Text>
          
          <View style={styles.colorPalette}>
            <View style={[styles.paletteColor, { backgroundColor: primaryClr }]} />
            <View style={[styles.paletteColor, { backgroundColor: headerBg }]} />
            <View style={[styles.paletteColor, { backgroundColor: bgColor }]} />
            <View style={[styles.paletteColor, { backgroundColor: submitBg }]} />
          </View>
        </View>

        {/* Selected Indicator */}
        {isSelected && (
          <View style={[styles.selectedBadge, { backgroundColor: submitBg }]}>
            <Check size={14} color="#fff" strokeWidth={3} />
          </View>
        )}

        {/* Loading Overlay */}
        {isUpdating && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const isPageLoading = isLoading || loadingDetails;
  const themesToShow = detailedThemes.length > 0 ? detailedThemes : themes;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBackgroundColor} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding, backgroundColor: theme.headerBackgroundColor }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.activeMenuBackgroundColor }]} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={theme.textColor} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Temalar</Text>
          <Text style={[styles.headerSubtitle, { color: theme.labelColor }]}>
            Uygulamanızı kişiselleştirin
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          {isUpdating && <ActivityIndicator size="small" color={theme.activeMenuColor} />}
        </View>
      </View>

      {/* Content */}
      {isPageLoading && !themesToShow ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.activeMenuColor} />
          <Text style={[styles.loadingText, { color: theme.labelColor }]}>Temalar yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Theme Banner */}
          <View style={[styles.currentBanner, { backgroundColor: theme.menuBackgroundColor }]}>
            <View style={[styles.bannerIcon, { backgroundColor: theme.activeMenuBackgroundColor }]}>
              <Sparkles size={24} color={theme.activeMenuColor} />
            </View>
            <View style={styles.bannerText}>
              <Text style={[styles.bannerLabel, { color: theme.labelColor }]}>Aktif Tema</Text>
              <Text style={[styles.bannerTitle, { color: theme.textColor }]}>
                {formatThemeName(currentThemeName)}
              </Text>
            </View>
          </View>

          {/* Themes Grid */}
          <View style={styles.themesGrid}>
            {themesToShow && themesToShow.map((item: any) => renderThemeCard(item))}
          </View>
          
          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  headerRight: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  currentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 14,
  },
  bannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  themeCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  phoneFrame: {
    height: 140,
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
  },
  phoneStatusBar: {
    height: 12,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  statusBarDots: {
    flexDirection: 'row',
    gap: 3,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  phoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  headerLines: {
    flex: 1,
    gap: 4,
  },
  headerLine: {
    height: 4,
    borderRadius: 2,
  },
  phoneContent: {
    flex: 1,
    padding: 6,
    gap: 6,
  },
  contentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
    gap: 6,
  },
  cardIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  cardLines: {
    flex: 1,
    gap: 3,
  },
  cardLine: {
    height: 3,
    borderRadius: 1.5,
  },
  phoneBottom: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  bottomButton: {
    height: 14,
    borderRadius: 7,
  },
  themeInfo: {
    padding: 12,
    paddingTop: 8,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 6,
  },
  paletteColor: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});
