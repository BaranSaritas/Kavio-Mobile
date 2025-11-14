import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../api/axiosInstance';

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
      await AsyncStorage.setItem('theme', response?.data?.name);
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

interface ThemeState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  themes: any;
  themeDetail: any;
}

const initialState: ThemeState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  themes: null,
  themeDetail: null,
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
      })
      .addCase(getTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen bir hata oluştu.';
        state.themeDetail = null;
      });
  },
});

export const { resetThemes } = ThemeSlice.actions;
export default ThemeSlice.reducer;
