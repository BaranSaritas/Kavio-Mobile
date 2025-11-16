import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Connection,
  ConnectionsResponse,
  RemoveConnectionRequest,
  BlockConnectionRequest,
  ConnectionsApiResponse,
} from '../../types/connection.types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api-url.com/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      await AsyncStorage.removeItem('authToken');
      // TODO: Navigate to login
    }
    return Promise.reject(error);
  }
);

class ConnectionsService {
  /**
   * Tüm bağlantıları getir
   */
  async getConnections(page = 1, limit = 20): Promise<ConnectionsResponse> {
    try {
      const response = await api.get<ConnectionsApiResponse<ConnectionsResponse>>(
        '/connections',
        { params: { page, limit } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Get connections error:', error);
      throw error;
    }
  }

  /**
   * Tek bir bağlantı detayını getir
   */
  async getConnectionById(connectionId: string): Promise<Connection> {
    try {
      const response = await api.get<ConnectionsApiResponse<Connection>>(
        `/connections/${connectionId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Get connection by ID error:', error);
      throw error;
    }
  }

  /**
   * Bağlantıyı kaldır
   */
  async removeConnection(
    request: RemoveConnectionRequest
  ): Promise<ConnectionsApiResponse> {
    try {
      const response = await api.delete<ConnectionsApiResponse>(
        `/connections/${request.connectionId}`
      );
      return response.data;
    } catch (error) {
      console.error('Remove connection error:', error);
      throw error;
    }
  }

  /**
   * Bağlantıyı engelle
   */
  async blockConnection(
    request: BlockConnectionRequest
  ): Promise<ConnectionsApiResponse> {
    try {
      const response = await api.post<ConnectionsApiResponse>(
        `/connections/${request.connectionId}/block`,
        { reason: request.reason }
      );
      return response.data;
    } catch (error) {
      console.error('Block connection error:', error);
      throw error;
    }
  }

  /**
   * Bağlantı engellemeyi kaldır
   */
  async unblockConnection(connectionId: string): Promise<ConnectionsApiResponse> {
    try {
      const response = await api.post<ConnectionsApiResponse>(
        `/connections/${connectionId}/unblock`
      );
      return response.data;
    } catch (error) {
      console.error('Unblock connection error:', error);
      throw error;
    }
  }

  /**
   * Bağlantı ara
   */
  async searchConnections(query: string): Promise<Connection[]> {
    try {
      const response = await api.get<ConnectionsApiResponse<Connection[]>>(
        '/connections/search',
        { params: { q: query } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Search connections error:', error);
      throw error;
    }
  }
}

export default new ConnectionsService();
