import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { deleteContact } from '../redux/slices/ContactsSlice';
import { Ionicons } from '@expo/vector-icons';

interface ContactCardProps {
  contact: {
    id: number;
    nameSurname: string;
    email: string;
    phone: string;
    note?: string;
    agreementChecked: boolean;
    connectStatus: string;
    createdAt: string;
    location?: {
      latitude?: number;
      longitude?: number;
      city?: string;
      country?: string;
    };
  };
  actionLoading?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, actionLoading = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleCall = () => {
    Linking.openURL(`tel:${contact.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contact.email}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Kişiyi Sil',
      'Bu kişiyi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => dispatch(deleteContact({ contactId: contact.id }) as any),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.headerBackgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.primaryColor }]}>
          <Text style={[styles.avatarText, { color: theme.textColor }]}>
            {contact.nameSurname.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: theme.textColor }]}>
            {contact.nameSurname}
          </Text>
          <Text style={[styles.date, { color: theme.labelColor }]}>
            {formatDate(contact.createdAt)}
          </Text>
        </View>

        <View style={[styles.statusBadge, { 
          backgroundColor: contact.connectStatus === 'CONNECTED' 
            ? theme.submitButtonBackgroundColor 
            : theme.linkBackgroundColor 
        }]}>
          <Text style={styles.statusText}>
            {contact.connectStatus === 'CONNECTED' ? 'Bağlı' : 'Bağlantısız'}
          </Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.contactInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={16} color={theme.activeMenuColor} />
          <Text style={[styles.infoText, { color: theme.textColor }]} numberOfLines={1}>
            {contact.email}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color={theme.activeMenuColor} />
          <Text style={[styles.infoText, { color: theme.textColor }]}>
            {contact.phone}
          </Text>
        </View>

        {contact.location && (contact.location.city || contact.location.country) && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={theme.activeMenuColor} />
            <Text style={[styles.infoText, { color: theme.textColor }]}>
              {[contact.location.city, contact.location.country].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}

        {contact.note && (
          <View style={[styles.noteContainer, { backgroundColor: theme.titleBackground }]}>
            <Text style={[styles.noteLabel, { color: theme.labelColor }]}>Not:</Text>
            <Text style={[styles.noteText, { color: theme.textColor }]}>
              {contact.note}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.submitButtonBackgroundColor }]}
          onPress={handleCall}
        >
          <Ionicons name="call" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Ara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.activeMenuColor }]}
          onPress={handleEmail}
        >
          <Ionicons name="mail" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>E-posta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton, { backgroundColor: theme.linkBackgroundColor }]}
          onPress={handleDelete}
          disabled={actionLoading}
        >
          <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>

      {/* Agreement Badge */}
      {contact.agreementChecked && (
        <View style={styles.agreementBadge}>
          <Ionicons name="checkmark-circle" size={14} color={theme.submitButtonBackgroundColor} />
          <Text style={[styles.agreementText, { color: theme.labelColor }]}>
            KVKK Onayı Verildi
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  contactInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  noteContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  deleteButton: {
    flex: 0.7,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  agreementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  agreementText: {
    fontSize: 11,
    marginLeft: 6,
  },
});

export default ContactCard;
