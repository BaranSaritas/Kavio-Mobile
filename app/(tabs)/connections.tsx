import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useConnections } from '../../hooks/useConnections';
import ConnectionCard from '../../components/connections/ConnectionCard';
import ConnectionsSkeleton from '../../components/connections/ConnectionsSkeleton';

const { width } = Dimensions.get('window');

export default function ConnectionsScreen() {
  const {
    connections,
    loading,
    refreshing,
    hasMore,
    handleRefresh,
    handleLoadMore,
    handleRemoveConnection,
    handleBlockConnection,
  } = useConnections();

  // Responsive columns
  const numColumns = width > 768 ? 3 : width > 500 ? 2 : 1;

  // Mock data için (API hazır olana kadar)
  const [useMockData] = useState(true);
  const mockConnections = [
    {
      id: '1',
      fullName: 'Eray Hacıoğlu',
      job: 'Frontend Developer',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '2',
      fullName: 'Ayşe Yılmaz',
      job: 'UI/UX Designer',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: '3',
      fullName: 'Mehmet Demir',
      job: 'Backend Developer',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: '4',
      fullName: 'Zeynep Kaya',
      job: 'Product Manager',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
      id: '5',
      fullName: 'Ahmet Çelik',
      job: 'DevOps Engineer',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '6',
      fullName: 'Fatma Şahin',
      job: 'Data Scientist',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
  ];

  const displayConnections = useMockData ? mockConnections : connections;

  if (loading && displayConnections.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bağlantılarım</Text>
        </View>
        <ConnectionsSkeleton cardCount={6} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bağlantılarım</Text>
        <Text style={styles.subtitle}>{displayConnections.length} bağlantı</Text>
      </View>

      {/* Empty State */}
      {displayConnections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz bağlantınız yok</Text>
        </View>
      ) : (
        /* Connection List */
        <FlatList
          data={displayConnections}
          renderItem={({ item }) => (
            <ConnectionCard
              item={item}
              onRemove={handleRemoveConnection}
              onBlock={handleBlockConnection}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141e22',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1a2428',
    borderBottomWidth: 1,
    borderBottomColor: '#2a3438',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A2A2A2',
    fontWeight: '500',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#A2A2A2',
    fontWeight: '500',
  },
});
