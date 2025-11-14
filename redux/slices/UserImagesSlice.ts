import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../api/axiosInstance';

export const getUserImages = createAsyncThunk(
  'card/user-images',
  async ({ cardId, signal }: any, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/card/user-images/${cardId}`, { signal });
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

export const getOtherUserImages = createAsyncThunk(
  'other-profile-management/user-images',
  async ({ cardId, signal }: any, { rejectWithValue }) => {
    try {
      const response = await Axios.get(
        `/other-profile-management/user-images/${cardId}`,
        { signal }
      );
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

interface UserImagesState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  bannerImg: string | null;
  profileImg: string | null;
}

const initialState: UserImagesState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  bannerImg: null,
  profileImg: null,
};

const UserImagesSlice = createSlice({
  name: 'userImages',
  initialState,
  reducers: {
    resetUserImages(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.bannerImg = null;
      state.profileImg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bannerImg = action.payload.bannerImg;
        state.profileImg = action.payload.profileImg;
      })
      .addCase(getUserImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
      })
      .addCase(getOtherUserImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOtherUserImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bannerImg = action.payload.bannerImg;
        state.profileImg = action.payload.profileImg;
      })
      .addCase(getOtherUserImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
      });
  },
});

export const { resetUserImages } = UserImagesSlice.actions;
export default UserImagesSlice.reducer;
