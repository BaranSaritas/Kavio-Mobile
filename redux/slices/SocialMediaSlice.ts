import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../api/axiosInstance';

interface SocialMediaData {
  [key: string]: any;
}

interface SocialMediaState {
  isLoading: boolean;
  loadingCount: number;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  data: SocialMediaData | null;
  socialMediaPlatforms: any[] | null;
  addedSocialMediaPlatforms: any[];
}

export const getSocialMediaData = createAsyncThunk(
  'profile-management/get-social-medias',
  async ({ cardId, signal }: { cardId: string; signal?: AbortSignal }, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/profile-management/get-social-medias/${cardId}`, {
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

export const getOtherSocialMediaData = createAsyncThunk(
  'other-profile-management/get-social-medias',
  async ({ cardId, signal }: { cardId: string; signal?: AbortSignal }, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/other-profile-management/get-social-medias/${cardId}`, {
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

export const getSocialMediaPlatformsData = createAsyncThunk(
  'social-media-platforms/social-media-platforms',
  async ({ signal }: { signal?: AbortSignal }, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/social-media-platforms/social-media-platforms`, {
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

export const updateSocialMedia = createAsyncThunk(
  'social-media-platforms/bulk-update',
  async ({ cardId, updatedData }: { cardId: string; updatedData: any }, { rejectWithValue }) => {
    try {
      const response = await Axios.post(
        `/social-media-platforms/bulk-update/${cardId}`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      if (!error.response) throw error;

      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

const initialState: SocialMediaState = {
  isLoading: false,
  loadingCount: 0,
  isSuccess: false,
  isError: false,
  message: '',
  data: null,
  socialMediaPlatforms: null,
  addedSocialMediaPlatforms: [],
};

const SocialMediaSlice = createSlice({
  name: 'socialMedia',
  initialState,
  reducers: {
    setAddedSocialMediaPlatforms(state, action: PayloadAction<any[]>) {
      state.addedSocialMediaPlatforms = action.payload;
    },
    setUpdateSocialMedia(state, action: PayloadAction<SocialMediaData>) {
      state.data = action.payload;
    },
    resetSocialMedia(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSocialMediaData.pending, (state) => {
        state.isLoading = true;
        state.loadingCount += 1;
      })
      .addCase(getSocialMediaData.fulfilled, (state, action) => {
        state.loadingCount = Math.max(0, state.loadingCount - 1);
        state.isLoading = state.loadingCount > 0;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getSocialMediaData.rejected, (state, action) => {
        state.loadingCount = Math.max(0, state.loadingCount - 1);
        state.isLoading = state.loadingCount > 0;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.data = null;
      })
      .addCase(getOtherSocialMediaData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOtherSocialMediaData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getOtherSocialMediaData.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.data = null;
      })
      .addCase(getSocialMediaPlatformsData.pending, (state) => {
        state.isLoading = true;
        state.loadingCount += 1;
      })
      .addCase(getSocialMediaPlatformsData.fulfilled, (state, action) => {
        state.loadingCount = Math.max(0, state.loadingCount - 1);
        state.isLoading = state.loadingCount > 0;
        state.isSuccess = true;
        state.socialMediaPlatforms = action.payload;
      })
      .addCase(getSocialMediaPlatformsData.rejected, (state, action) => {
        state.loadingCount = Math.max(0, state.loadingCount - 1);
        state.isLoading = state.loadingCount > 0;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.socialMediaPlatforms = null;
      })
      .addCase(updateSocialMedia.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSocialMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(updateSocialMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.data = null;
      });
  },
});

export const { setAddedSocialMediaPlatforms, setUpdateSocialMedia, resetSocialMedia } =
  SocialMediaSlice.actions;
export default SocialMediaSlice.reducer;
