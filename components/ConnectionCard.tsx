import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { acceptConnection, declineConnection, blockConnection, deleteConnection } from '../redux/slices/ConnectionsSlice';

interface ConnectionCardProps {
  connection: {
    id: number;
    sender: {
      id: number;
      cardName: string;
      user: {
        firstName: string;
        lastName: string;
        profileImageUrl: string | null;
      };
      company: {
        name: string;
      };
    };
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
    createdAt: string;
  };
  isReceived?: boolean;
  actionLoading?: boolean;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, isReceived = false, actionLoading = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleAccept = () => {
    dispatch(acceptConnection({ connectionId: connection.id }) as any);
  };

  const handleDecline = () => {
    Alert.alert(
      'Bağlantıyı Reddet',
      'Bu bağlantıyı reddetmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Reddet',
          style: 'destructive',
          onPress: () => dispatch(declineConnection({ connectionId: connection.id }) as any),
        },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      'Kullanıcıyı Engelle',
      'Bu kullanıcıyı engellemek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Engelle',
          style: 'destructive',
          onPress: () => dispatch(blockConnection({ connectionId: connection.id }) as any),
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Bağlantıyı Sil',
      'Bu bağlantıyı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => dispatch(deleteConnection({ connectionId: connection.id }) as any),
        },
      ]
    );
  };

  const getStatusText = () => {
    switch (connection.status) {
      case 'PENDING':
        return 'Beklemede';
      case 'ACCEPTED':
        return 'Kabul Edildi';
      case 'DECLINED':
        return 'Reddedildi';
      case 'BLOCKED':
        return 'Engellendi';
      default:
        return connection.status;
    }
  };

  const getStatusColor = () => {
    switch (connection.status) {
      case 'PENDING':
        return '#FFA500';
      case 'ACCEPTED':
        return theme.submitButtonBackgroundColor;
      case 'DECLINED':
        return '#FF6B6B';
      case 'BLOCKED':
        return '#DC3545';
      default:
        return theme.labelColor;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.headerBackgroundColor }]}>
      {/* Kullanıcı Bilgileri */}
      <View style={styles.userInfo}>
        <View style={[styles.avatarContainer, { borderColor: theme.avatarBorderColor }]}>
          {connection.sender.user.profileImageUrl ? (
            <Image
              source={{ uri: connection.sender.user.profileImageUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primaryColor }]}>
              <Text style={[styles.avatarText, { color: theme.textColor }]}>
                {connection.sender.user.firstName[0]}{connection.sender.user.lastName[0]}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <Text style={[styles.name, { color: theme.textColor }]}>
            {connection.sender.user.firstName} {connection.sender.user.lastName}
          </Text>
          <Text style={[styles.company, { color: theme.jobColor }]}>
            {connection.sender.company.name}
          </Text>
          <Text style={[styles.cardName, { color: theme.labelColor }]}>
            {connection.sender.cardName}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      {/* Aksiyon Butonları */}
      {actionLoading ? (
        <ActivityIndicator color={theme.primaryColor} style={styles.loader} />
      ) : (
        <View style={styles.actions}>
          {connection.status === 'PENDING' && isReceived && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton, { backgroundColor: theme.submitButtonBackgroundColor }]}
                onPress={handleAccept}
              >
                <Text style={styles.buttonText}>Kabul Et</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.declineButton, { backgroundColor: theme.linkBackgroundColor }]}
                onPress={handleDecline}
              >
                <Text style={styles.buttonText}>Reddet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.blockButton, { backgroundColor: '#DC3545' }]}
                onPress={handleBlock}
              >
                <Text style={styles.buttonText}>Engelle</Text>
              </TouchableOpacity>
            </>
          )}

          {connection.status === 'ACCEPTED' && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, { backgroundColor: theme.linkBackgroundColor }]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Bağlantıyı Kaldır</Text>
            </TouchableOpacity>
          )}

          {(connection.status === 'DECLINED' || connection.status === 'BLOCKED') && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, { backgroundColor: theme.linkBackgroundColor }]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Sil</Text>
            </TouchableOpacity>
          )}
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    marginBottom: 2,
  },
  cardName: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  button: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  acceptButton: {},
  declineButton: {},
  blockButton: {},
  deleteButton: {},
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 12,
  },
});

export default ConnectionCard;
