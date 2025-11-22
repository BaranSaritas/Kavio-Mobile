import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../api/axiosInstance';

interface GuestContactPayload {
  nameSurname: string;
  email: string;
  phone: string;
  note: string;
  agreementChecked: boolean;
}

export const sendGuestContact = createAsyncThunk(
  'guestContact/send',
  async ({ cardId, data }: { cardId: string; data: GuestContactPayload }, { rejectWithValue }) => {
    try {
      const response = await Axios.post(`/guest-contact/${cardId}/send-message`, data);
      return response.data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Mesaj gönderilemedi');
    }
  }
);

interface GuestContactState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: GuestContactState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

const GuestContactSlice = createSlice({
  name: 'guestContact',
  initialState,
  reducers: {
    resetGuestContact(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendGuestContact.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(sendGuestContact.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Mesajınız başarıyla gönderildi';
      })
      .addCase(sendGuestContact.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Mesaj gönderilemedi';
      });
  },
});

export const { resetGuestContact } = GuestContactSlice.actions;
export default GuestContactSlice.reducer;
