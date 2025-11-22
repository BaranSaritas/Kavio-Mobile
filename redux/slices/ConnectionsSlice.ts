import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../api/axiosInstance';

export const getConnections = createAsyncThunk(
  'connections/get-connections',
  async ({ cardId }: { cardId: number }, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`/connections/card/${cardId}`);
      return response.data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

export const acceptConnection = createAsyncThunk(
  'connections/accept',
  async ({ connectionId }: { connectionId: number }, { rejectWithValue }) => {
    try {
      const response = await Axios.put(`/connections/${connectionId}/accept`);
      return { connectionId, data: response.data };
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

export const declineConnection = createAsyncThunk(
  'connections/decline',
  async ({ connectionId }: { connectionId: number }, { rejectWithValue }) => {
    try {
      const response = await Axios.put(`/connections/${connectionId}/decline`);
      return { connectionId, data: response.data };
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

export const blockConnection = createAsyncThunk(
  'connections/block',
  async ({ connectionId }: { connectionId: number }, { rejectWithValue }) => {
    try {
      const response = await Axios.put(`/connections/${connectionId}/block`);
      return { connectionId, data: response.data };
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

export const deleteConnection = createAsyncThunk(
  'connections/delete',
  async ({ connectionId }: { connectionId: number }, { rejectWithValue }) => {
    try {
      await Axios.delete(`/connections/${connectionId}`);
      return { connectionId };
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bir hata oluştu');
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'connections/send',
  async ({ senderCardId, receiverCardId }: { senderCardId: string; receiverCardId: string }, { rejectWithValue }) => {
    try {
      const url = `/connections/send?senderCardId=${senderCardId}&receiverCardId=${receiverCardId}`;
      console.log('[sendConnectionRequest] Making request to:', url);
      const response = await Axios.post(url);
      console.log('[sendConnectionRequest] Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[sendConnectionRequest] Error:', error);
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Bağlantı isteği gönderilemedi');
    }
  }
);

export const checkConnectionStatus = createAsyncThunk(
  'connections/check-status',
  async ({ myCardId, otherCardId }: { myCardId: string; otherCardId: string }, { rejectWithValue }) => {
    try {
      const url = `/connections/check?code1=${myCardId}&code2=${otherCardId}`;
      console.log('[checkConnectionStatus] Making request to:', url);
      const response = await Axios.get(url);
      console.log('[checkConnectionStatus] Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[checkConnectionStatus] Error:', error);
      if (!error.response) throw error;
      return rejectWithValue(error.response.data?.message || 'Durum kontrolü başarısız');
    }
  }
);

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  role: string;
  verified: boolean;
}

interface Company {
  id: number;
  name: string;
  phone: string;
  companyEmail: string;
  logo: string;
}

interface Card {
  id: number;
  cardName: string;
  user: User;
  company: Company;
  contactInfo: any[];
  socialMediaAccounts: any[];
  links: any[];
  createdDate: string;
  updatedDate: string;
}

interface Connection {
  id: number;
  sender: Card;
  receiver: Card;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

interface ConnectionsState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  data: Connection[];
  actionLoading: boolean;
  isConnected: boolean | null;
  sendRequestLoading: boolean;
}

const initialState: ConnectionsState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: [],
  actionLoading: false,
  isConnected: null,
  sendRequestLoading: false,
};

const ConnectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    resetConnections(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.actionLoading = false;
      state.sendRequestLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Connections
      .addCase(getConnections.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Beklenmeyen Bir Hata Oluştu';
        state.data = [];
      })
      
      // Accept Connection
      .addCase(acceptConnection.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(acceptConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update connection status in state
        const connection = state.data.find(c => c.id === action.payload.connectionId);
        if (connection) {
          connection.status = 'ACCEPTED';
        }
      })
      .addCase(acceptConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Kabul etme başarısız';
      })
      
      // Decline Connection
      .addCase(declineConnection.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(declineConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update connection status in state
        const connection = state.data.find(c => c.id === action.payload.connectionId);
        if (connection) {
          connection.status = 'DECLINED';
        }
      })
      .addCase(declineConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Reddetme başarısız';
      })
      
      // Block Connection
      .addCase(blockConnection.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(blockConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update connection status in state
        const connection = state.data.find(c => c.id === action.payload.connectionId);
        if (connection) {
          connection.status = 'BLOCKED';
        }
      })
      .addCase(blockConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Engelleme başarısız';
      })
      
      // Delete Connection
      .addCase(deleteConnection.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove connection from state
        state.data = state.data.filter(c => c.id !== action.payload.connectionId);
      })
      .addCase(deleteConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || 'Silme başarısız';
      })
      
      // Send Connection Request
      .addCase(sendConnectionRequest.pending, (state) => {
        state.sendRequestLoading = true;
        state.isError = false;
      })
      .addCase(sendConnectionRequest.fulfilled, (state) => {
        state.sendRequestLoading = false;
        state.isSuccess = true;
        state.message = 'Bağlantı isteği gönderildi';
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.sendRequestLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || 'İstek gönderilemedi';
      })
      
      // Check Connection Status
      .addCase(checkConnectionStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkConnectionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isConnected = action.payload;
      })
      .addCase(checkConnectionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isConnected = null;
        state.message = (action.payload as string) || 'Durum kontrolü başarısız';
      });
  },
});

export const { resetConnections } = ConnectionsSlice.actions;
export default ConnectionsSlice.reducer;
