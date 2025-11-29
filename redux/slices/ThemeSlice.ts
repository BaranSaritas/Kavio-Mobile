import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../api/axiosInstance';
import themes, { Theme } from '../../constants/themes';

// Tüm temaları getir (sidebar preview)
export const getAllThemes = createAsyncThunk(
  'themes/sidebar-preview',
  async ({ signal }: any, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/themes/sidebar-preview`, { signal });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        return rejectWithValue('İstek iptal edildi');
      }
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

// Tema adına göre tema detaylarını getir
export const getThemeByName = createAsyncThunk(
  'themes/get-by-name',
  async ({ themeName, signal }: { themeName: string; signal?: AbortSignal }, { rejectWithValue }) => {
    try {
      console.log('Fetching theme by name:', themeName);
      
      // Önce tüm temaları getir (detaylı bilgi için)
      const allThemesResponse = await Axios.get('/themes/sidebar-preview', { signal });
      const allThemes = allThemesResponse.data;
      
      if (Array.isArray(allThemes)) {
        const foundTheme = allThemes.find((t: any) => t.name === themeName);
        
        if (foundTheme) {
          // Eğer tema detaylı bilgi içeriyorsa (backgroundColor varsa)
          if (foundTheme.backgroundColor) {
            await AsyncStorage.setItem('theme', foundTheme.name);
            await AsyncStorage.setItem('themeData', JSON.stringify(foundTheme));
            console.log('Theme loaded from sidebar-preview:', foundTheme.name, foundTheme.backgroundColor);
            return foundTheme;
          }
          
          // Detaylı bilgi yoksa, tema ID'si ile detay endpoint'ini çağır
          try {
            const detailResponse = await Axios.get(`/themes/${foundTheme.id}`, { signal });
            const themeData = detailResponse.data;
            
            if (themeData && themeData.backgroundColor) {
              await AsyncStorage.setItem('theme', themeData.name);
              await AsyncStorage.setItem('themeData', JSON.stringify(themeData));
              console.log('Theme loaded from detail endpoint:', themeData.name, themeData.backgroundColor);
              return themeData;
            }
          } catch (detailError) {
            console.log('Could not fetch theme detail by ID');
          }
        }
      }
      
      // Local temayı kontrol et
      if (themes[themeName]) {
        const localTheme = {
          id: 1,
          name: themeName,
          ...themes[themeName]
        };
        await AsyncStorage.setItem('theme', themeName);
        await AsyncStorage.setItem('themeData', JSON.stringify(localTheme));
        console.log('Theme loaded from local:', themeName);
        return localTheme;
      }
      
      // Hiçbiri yoksa default temayı döndür
      console.log('Theme not found, using default');
      const defaultThemeData = {
        id: 1,
        name: 'default',
        ...themes.default
      };
      return defaultThemeData;
      
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        return rejectWithValue('İstek iptal edildi');
      }
      console.log('getThemeByName error:', error?.message);
      
      // Hata durumunda local veya default temayı döndür
      if (themes[themeName]) {
        return {
          id: 1,
          name: themeName,
          ...themes[themeName]
        };
      }
      
      return {
        id: 1,
        name: 'default',
        ...themes.default
      };
    }
  }
);

// Tek tema detayı getir (ID ile)
export const getTheme = createAsyncThunk(
  'themes/get',
  async ({ id, signal }: any, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/themes/${id}`, { signal });
      const themeData = response.data;
      
      // Tema bilgilerini AsyncStorage'a kaydet
      await AsyncStorage.setItem('theme', themeData.name);
      await AsyncStorage.setItem('themeData', JSON.stringify(themeData));
      
      return themeData;
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        return rejectWithValue('İstek iptal edildi');
      }
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

// Kullanıcının temasını güncelle (API'ye kaydet + state güncelle)
export const updateCardTheme = createAsyncThunk(
  'themes/update-card-theme',
  async ({ cardId, themeName, themeData }: { cardId: number; themeName: string; themeData?: any }, { rejectWithValue }) => {
    try {
      // API'ye tema güncelleme isteği at
      await Axios.get(`/card/updateTheme/${cardId}/${themeName}`);
      
      // Tema bilgilerini AsyncStorage'a kaydet
      if (themeData) {
        await AsyncStorage.setItem('theme', themeName);
        await AsyncStorage.setItem('themeData', JSON.stringify(themeData));
        console.log('Theme updated and saved:', themeName, themeData.backgroundColor);
      }
      
      return { cardId, themeName, themeData };
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Tema güncellenemedi');
    }
  }
);

// AsyncStorage'dan kayıtlı temayı yükle
export const loadStoredTheme = createAsyncThunk(
  'themes/load-stored',
  async (_, { rejectWithValue }) => {
    try {
      const storedThemeData = await AsyncStorage.getItem('themeData');
      if (storedThemeData) {
        const parsed = JSON.parse(storedThemeData);
        console.log('Loaded theme from storage:', parsed?.name, parsed?.backgroundColor);
        return parsed;
      }
      // Eğer kayıtlı tema yoksa default temayı döndür
      return {
        id: 1,
        name: 'default',
        ...themes.default
      };
    } catch (error: any) {
      return rejectWithValue('Tema yükleme hatası');
    }
  }
);

interface ThemeDetail extends Theme {
  id: number;
  name: string;
}

interface ThemeState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isUpdating: boolean;
  message: string;
  themes: any;
  themeDetail: ThemeDetail | null;
  currentTheme: Theme;
  themeName: string;
}

// Default tema renklerini baştan yükle
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

const initialState: ThemeState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  isUpdating: false,
  message: '',
  themes: null,
  themeDetail: null,
  currentTheme: defaultTheme,
  themeName: 'default',
};

const applyThemeToState = (state: ThemeState, themeData: any) => {
  if (!themeData) return;
  
  state.themeDetail = themeData;
  state.currentTheme = {
    primaryColor: themeData.primaryColor || defaultTheme.primaryColor,
    backgroundColor: themeData.backgroundColor || defaultTheme.backgroundColor,
    headerBackgroundColor: themeData.headerBackgroundColor || defaultTheme.headerBackgroundColor,
    textColor: themeData.textColor || defaultTheme.textColor,
    menuBackgroundColor: themeData.menuBackgroundColor || defaultTheme.menuBackgroundColor,
    activeMenuBackgroundColor: themeData.activeMenuBackgroundColor || defaultTheme.activeMenuBackgroundColor,
    activeMenuColor: themeData.activeMenuColor || defaultTheme.activeMenuColor,
    titleBackground: themeData.titleBackground || defaultTheme.titleBackground,
    submitButtonBackgroundColor: themeData.submitButtonBackgroundColor || defaultTheme.submitButtonBackgroundColor,
    avatarBorderColor: themeData.avatarBorderColor || defaultTheme.avatarBorderColor,
    linkBackgroundColor: themeData.linkBackgroundColor || defaultTheme.linkBackgroundColor,
    labelColor: themeData.labelColor || defaultTheme.labelColor,
    jobColor: themeData.jobColor || defaultTheme.jobColor,
    addCompanyButton: themeData.addCompanyButton || defaultTheme.addCompanyButton,
    selectedMenuItem: themeData.selectedMenuItem || defaultTheme.selectedMenuItem,
  };
  state.themeName = themeData.name || 'default';
  
  console.log('Theme applied to state:', state.themeName, state.currentTheme.backgroundColor);
};

const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    resetThemes(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setLocalTheme(state, action: PayloadAction<string>) {
      const themeName = action.payload;
      if (themes[themeName]) {
        state.currentTheme = themes[themeName];
        state.themeName = themeName;
      }
    },
    // Direkt tema objesini uygula (tema seçiminde kullanılır)
    applyTheme(state, action: PayloadAction<any>) {
      applyThemeToState(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllThemes
      .addCase(getAllThemes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllThemes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.themes = action.payload;
      })
      .addCase(getAllThemes.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen bir hata oluştu.';
        state.themes = null;
      })
      // getThemeByName
      .addCase(getThemeByName.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getThemeByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        applyThemeToState(state, action.payload);
      })
      .addCase(getThemeByName.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen bir hata oluştu.';
      })
      // getTheme
      .addCase(getTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        applyThemeToState(state, action.payload);
      })
      .addCase(getTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen bir hata oluştu.';
        state.themeDetail = null;
      })
      // updateCardTheme
      .addCase(updateCardTheme.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateCardTheme.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.isSuccess = true;
        // Seçilen temayı hemen uygula
        if (action.payload.themeData) {
          applyThemeToState(state, action.payload.themeData);
        }
      })
      .addCase(updateCardTheme.rejected, (state, action) => {
        state.isUpdating = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Tema güncellenemedi.';
      })
      // loadStoredTheme
      .addCase(loadStoredTheme.fulfilled, (state, action) => {
        applyThemeToState(state, action.payload);
      });
  },
});

export const { resetThemes, setLocalTheme, applyTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;
