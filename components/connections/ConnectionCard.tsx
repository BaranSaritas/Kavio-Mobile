import { Ban, UserX } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Connection } from '../../types/connection.types';
import { getAvatarUrl } from '../../utils/connectionHelpers';

const { width } = Dimensions.get('window');

interface ConnectionCardProps {
  item: Connection;
  onRemove: (id: string) => void;
  onBlock: (id: string) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ item, onRemove, onBlock }) => {
  const handleCardPress = () => {
    // Profil detay sayfasına git
   // router.push(`/user/${item.id}`);
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.7}
        onPress={handleCardPress}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: getAvatarUrl(item.avatar, item.fullName) }} 
            style={styles.avatar}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.fullName} numberOfLines={1}>
            {item.fullName}
          </Text>
          <Text style={styles.job} numberOfLines={1}>
            {item.job}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => onRemove(item.id)}
          activeOpacity={0.7}
        >
          <UserX size={16} color="#A2A2A2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => onBlock(item.id)}
          activeOpacity={0.7}
        >
          <Ban size={16} color="#A2A2A2" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 5,
    minWidth: width > 768 ? '31%' : width > 500 ? '47%' : '100%',
    maxWidth: width > 768 ? '31%' : width > 500 ? '47%' : '100%',
  },
  card: {
    backgroundColor: '#1a2428',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#2a3438',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#2a3438',
    padding: 3,
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  job: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A2A2A2',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a2428',
    borderWidth: 1,
    borderColor: '#2a3438',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConnectionCard;
