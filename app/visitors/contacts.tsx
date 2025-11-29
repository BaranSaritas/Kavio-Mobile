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
import { useTheme } from '../../hooks/useTheme';
import { getContacts } from '../../redux/slices/ContactsSlice';
import { AppDispatch, RootState } from '../../redux/store';

export default function ContactsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
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
    <View style={[styles.card, { backgroundColor: theme.menuBackgroundColor }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.activeMenuBackgroundColor }]}>
          <Text style={[styles.avatarText, { color: theme.activeMenuColor }]}>
            {item.nameSurname?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: theme.textColor }]}>{item.nameSurname || 'Unknown'}</Text>
          {item.location?.city && (
            <View style={styles.locationRow}>
              <MapPin size={12} color={theme.labelColor} />
              <Text style={[styles.cardLocation, { color: theme.labelColor }]}>
                {item.location.city}
                {item.location.country ? `, ${item.location.country}` : ''}
              </Text>
            </View>
          )}
          {item.note && (
            <View style={styles.noteRow}>
              <FileText size={12} color={theme.labelColor} />
              <Text style={[styles.cardNote, { color: theme.labelColor }]} numberOfLines={1}>
                {item.note}
              </Text>
            </View>
          )}
          <Text style={[styles.cardDate, { color: theme.jobColor }]}>
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
            style={[styles.actionButton, { backgroundColor: theme.activeMenuBackgroundColor }]}
            onPress={() => handleContactPress('phone', item.phone)}
          >
            <Phone size={18} color={theme.activeMenuColor} />
          </TouchableOpacity>
        )}
        {item.email && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.activeMenuBackgroundColor }]}
            onPress={() => handleContactPress('email', item.email)}
          >
            <Mail size={18} color={theme.activeMenuColor} />
          </TouchableOpacity>
        )}
        {item.phone && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.activeMenuBackgroundColor }]}
            onPress={() => handleContactPress('whatsapp', item.phone)}
          >
            <MessageCircle size={18} color={theme.activeMenuColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading && contacts.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.activeMenuColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Empty State */}
      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Mail size={48} color={theme.labelColor} />
          <Text style={[styles.emptyText, { color: theme.textColor }]}>No contacts yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.labelColor }]}>
            People who visit your profile will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactCard}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isLoading} 
              onRefresh={handleRefresh} 
              tintColor={theme.activeMenuColor} 
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  card: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
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
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  cardNote: {
    fontSize: 13,
    fontStyle: 'italic',
    flex: 1,
  },
  cardDate: {
    fontSize: 12,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
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
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
