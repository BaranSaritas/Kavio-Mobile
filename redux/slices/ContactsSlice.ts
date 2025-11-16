import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../api/axiosInstance';

export const getContacts = createAsyncThunk(
  'contacts/get-contacts',
  async ({ cardId }: { cardId: number }, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/guest-contact/card/${cardId}`);
      return response.data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

interface Contact {
  id: number;
  nameSurname: string;
  email: string;
  note?: string;
  phone: string;
  agreementChecked: boolean;
  connectStatus: string;
  createdAt: string;
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
  };
}

interface ContactsState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  data: Contact[];
}

const initialState: ContactsState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: [],
};

const ContactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetContacts(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContacts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.data = [];
      });
  },
});

export const { resetContacts } = ContactsSlice.actions;
export default ContactsSlice.reducer;
