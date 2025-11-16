import { FileText, Mail, MapPin, MessageCircle, Phone } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getContacts } from '../../redux/slices/ContactsSlice';
import { AppDispatch, RootState } from '../../redux/store';

export default function ContactsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { data: contacts, isLoading } = useSelector((state: RootState) => state.contacts);
  const cardId = user?.cardId;

  useEffect(() => {
    if (cardId) {
      dispatch(getContacts({ cardId }));
    }
  }, [cardId, dispatch]);

  const handleRefresh = () => {
    if (cardId) {
      dispatch(getContacts({ cardId }));
    }
  };

  const handleContactPress = (type: string, value: string) => {
    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'whatsapp':
        Linking.openURL(`https://wa.me/${value.replace(/[^0-9]/g, '')}`);
        break;
    }
  };

  const renderContactCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {item.nameSurname?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.nameSurname || 'Unknown'}</Text>
          {item.location?.city && (
            <View style={styles.locationRow}>
              <MapPin size={12} color="#A2A2A2" />
              <Text style={styles.cardLocation}>
                {item.location.city}
                {item.location.country ? `, ${item.location.country}` : ''}
              </Text>
            </View>
          )}
          {item.note && (
            <View style={styles.noteRow}>
              <FileText size={12} color="#A2A2A2" />
              <Text style={styles.cardNote} numberOfLines={1}>
                {item.note}
              </Text>
            </View>
          )}
          <Text style={styles.cardDate}>
            {new Date(item.createdAt).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {item.phone && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleContactPress('phone', item.phone)}
          >
            <Phone size={18} color="#7196AC" />
          </TouchableOpacity>
        )}
        {item.email && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleContactPress('email', item.email)}
          >
            <Mail size={18} color="#7196AC" />
          </TouchableOpacity>
        )}
        {item.phone && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleContactPress('whatsapp', item.phone)}
          >
            <MessageCircle size={18} color="#7196AC" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading && contacts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7196AC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Empty State */}
      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Mail size={48} color="#444" />
          <Text style={styles.emptyText}>No contacts yet</Text>
          <Text style={styles.emptySubtext}>
            People who visit your profile will appear here
          </Text>
        </View>
      ) : (
        /* Contact List */
<FlatList
  data={contacts}
  renderItem={renderContactCard}
  keyExtractor={(item, index) =>
    item?.id ? item.id.toString() : index.toString()
  }
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor="#7196AC" />
  }
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
  centerContainer: {
    flex: 1,
    backgroundColor: '#141e22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#1B272C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#273034',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7196AC',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 13,
    color: '#A2A2A2',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  cardNote: {
    fontSize: 13,
    color: '#A2A2A2',
    fontStyle: 'italic',
    flex: 1,
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#273034',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A2A2A2',
    textAlign: 'center',
    lineHeight: 20,
  },
});
