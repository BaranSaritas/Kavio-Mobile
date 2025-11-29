import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Theme } from '../constants/themes';

// Default tema renklerini burada tanımla - her zaman kullanılabilir
const defaultTheme: Theme = {
  primaryColor: "#3C616D",
  backgroundColor: "#141e22",
  headerBackgroundColor: "#273034",
  textColor: "#ffffff",
  menuBackgroundColor: "#1B272C",
  activeMenuBackgroundColor: "#10181B",
  activeMenuColor: "#7196AC",
  titleBackground: "#243239",
  submitButtonBackgroundColor: "#70C094",
  avatarBorderColor: "#7196ac",
  linkBackgroundColor: "#32424A",
  labelColor: "#8E8E8E",
  jobColor: "#A2A2A2",
  addCompanyButton: "#10181B",
  selectedMenuItem: "#D9D9D9"
};

/**
 * useTheme Hook
 * 
 * Uygulamanın her yerinden tema renklerine kolayca erişim sağlar.
 * Eğer tema yüklenmemişse default temayı döndürür.
 */
export const useTheme = (): Theme => {
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  
  // Eğer tema yüklenmemişse veya eksik alanlar varsa default temayı döndür
  if (!currentTheme || !currentTheme.backgroundColor || !currentTheme.textColor) {
    return defaultTheme;
  }
  
  // Eksik alanları default ile doldur
  return {
    ...defaultTheme,
    ...currentTheme
  };
};

/**
 * useThemeName Hook
 * 
 * Mevcut tema adını döndürür
 */
export const useThemeName = (): string => {
  const themeName = useSelector((state: RootState) => state.theme.themeName);
  return themeName || 'default';
};

/**
 * useThemeLoading Hook
 * 
 * Tema yükleme durumunu döndürür
 */
export const useThemeLoading = (): boolean => {
  const isLoading = useSelector((state: RootState) => state.theme.isLoading);
  return isLoading;
};

export default useTheme;
