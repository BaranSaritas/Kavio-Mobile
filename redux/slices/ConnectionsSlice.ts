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
}

const initialState: ConnectionsState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: [],
  actionLoading: false,
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
      });
  },
});

export const { resetConnections } = ConnectionsSlice.actions;
export default ConnectionsSlice.reducer;
