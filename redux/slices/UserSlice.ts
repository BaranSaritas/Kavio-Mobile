import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Axios from '../../api/axiosInstance';
import { generateMessage } from '../../utils/helpers';
import Constants from 'expo-constants';

const baseURL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8080/api';

export const login = createAsyncThunk(
  'user/login',
  async (loginData: any, thunkAPI) => {
    try {
      const res = await axios.post(`${baseURL}/user/login`, loginData);
      if (res?.status === 200 && res?.data?.accessToken) {
        await AsyncStorage.setItem('accessToken', res?.data?.accessToken);
        await AsyncStorage.setItem('refreshToken', res?.data?.refreshToken);
        await AsyncStorage.setItem('isLogin', 'true');
        return res?.data;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(generateMessage(error, 'Login Error'));
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async ({ registerData, uniqueId }: any, thunkAPI) => {
    try {
      const res = await axios.post(
        `${baseURL}/user/register-setup-card/${uniqueId}`,
        registerData
      );
      return res?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(generateMessage(error, 'Register Error'));
    }
  }
);

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const res = await Axios.get('/user/info');
    if (res?.status === 200 && res?.data?.id) {
      return res?.data;
    }
  } catch (error) {
    console.log('error', error);
    return null;
  }
});

export const getUserInfo = createAsyncThunk(
  'user/info',
  async (_, thunkAPI) => {
    try {
      const res = await Axios.get(`/user/info`);
      if (res?.status === 200 && res?.data?.id) {
        return res?.data;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(generateMessage(error, 'UserInfo Error'));
    }
  }
);

interface UserState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  user: any;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: UserState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  user: null,
  isAuthenticated: false,
  isHydrated: false,
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userSliceReset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    logout(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
      AsyncStorage.removeItem('isLogin');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action?.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action?.payload as string;
      })
      .addCase(hydrateAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = !!action?.payload;
        state.isHydrated = true;
        state.user = action?.payload;
      })
      .addCase(hydrateAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.isHydrated = true;
        state.user = null;
        state.message = action?.payload as string;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action?.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.user = null;
        state.message = action?.payload as string;
      });
  },
});

export const { userSliceReset, logout } = UserSlice.actions;
export default UserSlice.reducer;
