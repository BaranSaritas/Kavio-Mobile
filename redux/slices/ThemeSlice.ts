import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../api/axiosInstance';
import themes, { Theme } from '../../constants/themes';

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

export const loadStoredTheme = createAsyncThunk(
  'themes/load-stored',
  async (_, { rejectWithValue }) => {
    try {
      const storedThemeData = await AsyncStorage.getItem('themeData');
      if (storedThemeData) {
        return JSON.parse(storedThemeData);
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
  message: string;
  themes: any;
  themeDetail: ThemeDetail | null;
  currentTheme: Theme;
  themeName: string;
}

const initialState: ThemeState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  themes: null,
  themeDetail: null,
  currentTheme: themes.default,
  themeName: 'default',
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
    applyThemeFromDetail(state) {
      if (state.themeDetail) {
        state.currentTheme = {
          primaryColor: state.themeDetail.primaryColor,
          backgroundColor: state.themeDetail.backgroundColor,
          headerBackgroundColor: state.themeDetail.headerBackgroundColor,
          textColor: state.themeDetail.textColor,
          menuBackgroundColor: state.themeDetail.menuBackgroundColor,
          activeMenuBackgroundColor: state.themeDetail.activeMenuBackgroundColor,
          activeMenuColor: state.themeDetail.activeMenuColor,
          titleBackground: state.themeDetail.titleBackground,
          submitButtonBackgroundColor: state.themeDetail.submitButtonBackgroundColor,
          avatarBorderColor: state.themeDetail.avatarBorderColor,
          linkBackgroundColor: state.themeDetail.linkBackgroundColor,
          labelColor: state.themeDetail.labelColor,
          jobColor: state.themeDetail.jobColor,
          addCompanyButton: state.themeDetail.addCompanyButton,
          selectedMenuItem: state.themeDetail.selectedMenuItem,
        };
        state.themeName = state.themeDetail.name;
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(getTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.themeDetail = action.payload;
        // Tema detayı geldiğinde otomatik olarak uygula
        state.currentTheme = {
          primaryColor: action.payload.primaryColor,
          backgroundColor: action.payload.backgroundColor,
          headerBackgroundColor: action.payload.headerBackgroundColor,
          textColor: action.payload.textColor,
          menuBackgroundColor: action.payload.menuBackgroundColor,
          activeMenuBackgroundColor: action.payload.activeMenuBackgroundColor,
          activeMenuColor: action.payload.activeMenuColor,
          titleBackground: action.payload.titleBackground,
          submitButtonBackgroundColor: action.payload.submitButtonBackgroundColor,
          avatarBorderColor: action.payload.avatarBorderColor,
          linkBackgroundColor: action.payload.linkBackgroundColor,
          labelColor: action.payload.labelColor,
          jobColor: action.payload.jobColor,
          addCompanyButton: action.payload.addCompanyButton,
          selectedMenuItem: action.payload.selectedMenuItem,
        };
        state.themeName = action.payload.name;
      })
      .addCase(getTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen bir hata oluştu.';
        state.themeDetail = null;
      })
      .addCase(loadStoredTheme.fulfilled, (state, action) => {
        state.themeDetail = action.payload;
        state.currentTheme = {
          primaryColor: action.payload.primaryColor,
          backgroundColor: action.payload.backgroundColor,
          headerBackgroundColor: action.payload.headerBackgroundColor,
          textColor: action.payload.textColor,
          menuBackgroundColor: action.payload.menuBackgroundColor,
          activeMenuBackgroundColor: action.payload.activeMenuBackgroundColor,
          activeMenuColor: action.payload.activeMenuColor,
          titleBackground: action.payload.titleBackground,
          submitButtonBackgroundColor: action.payload.submitButtonBackgroundColor,
          avatarBorderColor: action.payload.avatarBorderColor,
          linkBackgroundColor: action.payload.linkBackgroundColor,
          labelColor: action.payload.labelColor,
          jobColor: action.payload.jobColor,
          addCompanyButton: action.payload.addCompanyButton,
          selectedMenuItem: action.payload.selectedMenuItem,
        };
        state.themeName = action.payload.name;
      });
  },
});

export const { resetThemes, setLocalTheme, applyThemeFromDetail } = ThemeSlice.actions;
export default ThemeSlice.reducer;
