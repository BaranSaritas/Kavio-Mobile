import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../api/axiosInstance';

export const getProfileData = createAsyncThunk(
  'profile-management/get-profile',
  async ({ cardId, signal }: any, { rejectWithValue }) => {
    try {
      const response = await Axios.get(
        `/profile-management/get-profile/${cardId}`,
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

export const getOtherProfileData = createAsyncThunk(
  'other-profile-management/get-profile',
  async ({ cardId }: any, { rejectWithValue }) => {
    try {
      const response = await Axios.get(
        `/other-profile-management/get-profile/${cardId}`
      );
      return response.data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

export const updateProfileData = createAsyncThunk(
  'profile-management/update-personel-information',
  async (updatedData: any, { rejectWithValue }) => {
    try {
      const response = await Axios.post(
        `/profile-management/update-personel-information`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

interface ProfileState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  data: any;
}

const initialState: ProfileState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null,
};

const ProfileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData(state, action) {
      state.data = action.payload;
    },
    resetProfile(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.data = null;
      })
      .addCase(getOtherProfileData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOtherProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getOtherProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.data = null;
      })
      .addCase(updateProfileData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(updateProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
      });
  },
});

export const { setProfileData, resetProfile } = ProfileSlice.actions;
export default ProfileSlice.reducer;
