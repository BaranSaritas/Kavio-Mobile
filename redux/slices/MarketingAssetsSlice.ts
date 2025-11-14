import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../api/axiosInstance';

interface MarketingAssetsData {
  [key: string]: any;
}

interface MarketingAssetsState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  data: MarketingAssetsData | null;
}

export const getMarketingAssetsData = createAsyncThunk(
  'profile-management/get-catalog-page',
  async ({ cardId, signal }: { cardId: string; signal?: AbortSignal }, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/profile-management/get-catalog-page/${cardId}`, {
        signal,
      });
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

export const getOtherMarketingAssetsData = createAsyncThunk(
  'other-profile-management/get-catalog-page',
  async ({ cardId, signal }: { cardId: string; signal?: AbortSignal }, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/other-profile-management/get-catalog-page/${cardId}`, {
        signal,
      });
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

export const deleteMarketingAssetsData = createAsyncThunk(
  'catalogs/delete',
  async ({ catalogId }: { catalogId: string }, { rejectWithValue }) => {
    try {
      const response = await Axios.delete(`/catalogs/${catalogId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

const initialState: MarketingAssetsState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null,
};

const MarketingAssetsSlice = createSlice({
  name: 'marketingAssets',
  initialState,
  reducers: {
    resetMarketingAssets(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMarketingAssetsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMarketingAssetsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action?.payload;
      })
      .addCase(getMarketingAssetsData.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.data = null;
      })
      .addCase(getOtherMarketingAssetsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOtherMarketingAssetsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action?.payload;
      })
      .addCase(getOtherMarketingAssetsData.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.data = null;
      })
      .addCase(deleteMarketingAssetsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMarketingAssetsData.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Katalog silindi';
      })
      .addCase(deleteMarketingAssetsData.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
      });
  },
});

export const { resetMarketingAssets } = MarketingAssetsSlice.actions;
export default MarketingAssetsSlice.reducer;
