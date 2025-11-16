import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import ConnectionsService from '../api/services/connections.service';
import { Connection } from '../types/connection.types';

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Bağlantıları yükle
  const fetchConnections = useCallback(async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      setError(null);

      const response = await ConnectionsService.getConnections(pageNum, 20);
      
      if (pageNum === 1) {
        setConnections(response.data);
      } else {
        setConnections((prev) => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 20);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Bağlantılar yüklenirken hata oluştu');
      Alert.alert('Hata', 'Bağlantılar yüklenirken bir sorun oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    fetchConnections(1);
  }, []);

  // Yenile
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConnections(1);
  }, [fetchConnections]);

  // Daha fazla yükle
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchConnections(page + 1);
    }
  }, [loading, hasMore, page, fetchConnections]);

  // Bağlantıyı kaldır
  const handleRemoveConnection = useCallback(async (connectionId: string) => {
    Alert.alert(
      'Bağlantıyı Kaldır',
      'Bu bağlantıyı kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: async () => {
            try {
              await ConnectionsService.removeConnection({ connectionId });
              setConnections((prev) => prev.filter((conn) => conn.id !== connectionId));
              Alert.alert('Başarılı', 'Bağlantı kaldırıldı');
            } catch (err: any) {
              Alert.alert('Hata', 'Bağlantı kaldırılırken bir sorun oluştu');
            }
          },
        },
      ]
    );
  }, []);

  // Bağlantıyı engelle
  const handleBlockConnection = useCallback(async (connectionId: string) => {
    Alert.alert(
      'Bağlantıyı Engelle',
      'Bu kullanıcıyı engellemek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Engelle',
          style: 'destructive',
          onPress: async () => {
            try {
              await ConnectionsService.blockConnection({ connectionId });
              setConnections((prev) => prev.filter((conn) => conn.id !== connectionId));
              Alert.alert('Başarılı', 'Kullanıcı engellendi');
            } catch (err: any) {
              Alert.alert('Hata', 'Kullanıcı engellenirken bir sorun oluştu');
            }
          },
        },
      ]
    );
  }, []);

  // Bağlantı ara
  const handleSearchConnections = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const results = await ConnectionsService.searchConnections(query);
      setConnections(results);
    } catch (err: any) {
      Alert.alert('Hata', 'Arama yapılırken bir sorun oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    connections,
    loading,
    refreshing,
    error,
    hasMore,
    fetchConnections,
    handleRefresh,
    handleLoadMore,
    handleRemoveConnection,
    handleBlockConnection,
    handleSearchConnections,
  };
};
