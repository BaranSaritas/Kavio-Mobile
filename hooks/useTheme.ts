import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Theme } from '../constants/themes';

/**
 * useTheme Hook
 * 
 * Uygulamanın her yerinden tema renklerine kolayca erişim sağlar.
 * 
 * @example
 * ```tsx
 * import { useTheme } from '../hooks/useTheme';
 * 
 * const MyComponent = () => {
 *   const theme = useTheme();
 *   
 *   return (
 *     <View style={{ backgroundColor: theme.backgroundColor }}>
 *       <Text style={{ color: theme.textColor }}>Hello</Text>
 *     </View>
 *   );
 * };
 * ```
 */
export const useTheme = (): Theme => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  return theme;
};

/**
 * useThemeName Hook
 * 
 * Mevcut tema adını döndürür
 */
export const useThemeName = (): string => {
  const themeName = useSelector((state: RootState) => state.theme.themeName);
  return themeName;
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
