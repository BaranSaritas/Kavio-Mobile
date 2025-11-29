import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { 
  getConnections, 
  acceptConnection, 
  declineConnection, 
  blockConnection, 
  deleteConnection 
} from '../../redux/slices/ConnectionsSlice';
import { Users, CheckCircle, Clock, XCircle, X, Check, Ban, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

export default function ConnectionsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.user);
  const { data: connections, isLoading, actionLoading } = useSelector(
    (state: RootState) => state.connections
  );
  const cardId = user?.cardId;

  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  // Tek kolon kullan - daha temiz görünüm
  const numColumns = 1;

  useEffect(() => {
    if (cardId) {
      dispatch(getConnections({ cardId }));
    }
  }, [cardId, dispatch]);

  const handleRefresh = () => {
    if (cardId) {
      dispatch(getConnections({ cardId }));
    }
  };

  // Kendi kartımız değilse sender, bizse receiver bilgisini döndür
  const getOtherPerson = (connection: any) => {
    if (connection.sender.id === cardId) {
      return connection.receiver;
    }
    return connection.sender;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle size={16} color={theme.submitButtonBackgroundColor} />;
      case 'PENDING':
        return <Clock size={16} color="#FFA500" />;
      case 'DECLINED':
      case 'BLOCKED':
        return <XCircle size={16} color="#ff6b6b" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'Kabul Edildi';
      case 'PENDING':
        return 'Beklemede';
      case 'DECLINED':
        return 'Reddedildi';
      case 'BLOCKED':
        return 'Engellendi';
      default:
        return status;
    }
  };

  const handleConnectionPress = (connection: any) => {
    // Navigate to connection's profile
    // const otherCard = getOtherPerson(connection);
    // router.push(`/user/${otherCard.id}/profile`);
  };

  const handleActionPress = (connection: any) => {
    setSelectedConnection(connection);
    setShowActionModal(true);
  };

  const handleAccept = async () => {
    if (!selectedConnection) return;
    
    try {
      await dispatch(acceptConnection({ connectionId: selectedConnection.id })).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Başarılı',
        text2: 'Bağlantı kabul edildi',
      });
      setShowActionModal(false);
      setSelectedConnection(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Kabul etme başarısız',
      });
    }
  };

  const handleDecline = async () => {
    if (!selectedConnection) return;
    
    try {
      await dispatch(declineConnection({ connectionId: selectedConnection.id })).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Başarılı',
        text2: 'Bağlantı reddedildi',
      });
      setShowActionModal(false);
      setSelectedConnection(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Reddetme başarısız',
      });
    }
  };

  const handleBlock = async () => {
    if (!selectedConnection) return;
    
    Alert.alert(
      'Engelle',
      'Bu kişiyi engellemek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Engelle',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(blockConnection({ connectionId: selectedConnection.id })).unwrap();
              Toast.show({
                type: 'success',
                text1: 'Başarılı',
                text2: 'Kişi engellendi',
              });
              setShowActionModal(false);
              setSelectedConnection(null);
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Engelleme başarısız',
              });
            }
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    if (!selectedConnection) return;
    
    Alert.alert(
      'Sil',
      'Bu bağlantıyı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteConnection({ connectionId: selectedConnection.id })).unwrap();
              Toast.show({
                type: 'success',
                text1: 'Başarılı',
                text2: 'Bağlantı silindi',
              });
              setShowActionModal(false);
              setSelectedConnection(null);
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Silme başarısız',
              });
            }
          },
        },
      ]
    );
  };

  const renderConnectionCard = ({ item }: { item: any }) => {
    const otherCard = getOtherPerson(item);
    const otherUser = otherCard.user;
    
    // İsim oluştur
    const fullName = `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || 'Unknown User';
    
    // Avatar
    const avatar = otherUser.profileImageUrl;
    
    // Email
    const email = otherUser.email || '';
    
    // Company
    const company = otherCard.company;
    const companyName = company?.name || '';
    const companyLogo = company?.logo || null;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.menuBackgroundColor }]}
        onPress={() => handleConnectionPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.activeMenuBackgroundColor }]}>
              <Text style={[styles.avatarText, { color: theme.activeMenuColor }]}>
                {otherUser.firstName?.charAt(0)?.toUpperCase() || 
                 otherUser.lastName?.charAt(0)?.toUpperCase() || 
                 'U'}
              </Text>
            </View>
          )}

          <Text style={[styles.cardName, { color: theme.textColor }]} numberOfLines={1}>
            {fullName}
          </Text>
          
          {email && email !== fullName && (
            <Text style={[styles.cardEmail, { color: theme.labelColor }]} numberOfLines={1}>
              {email}
            </Text>
          )}
          
          {/* Company Info */}
          {companyName && (
            <View style={styles.companyRow}>
              {companyLogo && (
                <Image source={{ uri: companyLogo }} style={styles.companyLogo} />
              )}
              <Text style={[styles.cardCompany, { color: theme.activeMenuColor }]} numberOfLines={1}>
                {companyName}
              </Text>
            </View>
          )}

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: theme.activeMenuBackgroundColor }]}>
            {getStatusIcon(item.status)}
            <Text style={[styles.statusText, getStatusStyle(item.status)]}>
              {getStatusText(item.status)}
            </Text>
          </View>

          <Text style={[styles.cardDate, { color: theme.jobColor }]}>
            {new Date(item.createdAt).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'short',
            })}
          </Text>
        </View>

        {/* Actions Button */}
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => handleActionPress(item)}
        >
          <View style={styles.moreIcon}>
            <View style={[styles.moreDot, { backgroundColor: theme.labelColor }]} />
            <View style={[styles.moreDot, { backgroundColor: theme.labelColor }]} />
            <View style={[styles.moreDot, { backgroundColor: theme.labelColor }]} />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return { color: theme.submitButtonBackgroundColor };
      case 'PENDING':
        return { color: '#FFA500' };
      case 'DECLINED':
      case 'BLOCKED':
        return { color: '#ff6b6b' };
      default:
        return { color: theme.labelColor };
    }
  };

  if (isLoading && connections.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.activeMenuColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Empty State */}
      {connections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Users size={48} color={theme.labelColor} />
          <Text style={[styles.emptyText, { color: theme.textColor }]}>No connections yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.labelColor }]}>
            Start networking to build your connections
          </Text>
        </View>
      ) : (
        /* Connection List */
        <FlatList
          data={connections}
          renderItem={renderConnectionCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          key={numColumns}
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

      {/* Action Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionModal(false)}
        >
          <View style={[styles.actionModal, { backgroundColor: theme.menuBackgroundColor }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.activeMenuBackgroundColor }]}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>İşlemler</Text>
              <TouchableOpacity onPress={() => setShowActionModal(false)}>
                <X size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            <View style={styles.actionList}>
              {selectedConnection?.status === 'PENDING' && (
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleAccept}
                  disabled={actionLoading}
                >
                  <Check size={20} color={theme.submitButtonBackgroundColor} />
                  <Text style={[styles.actionText, { color: theme.textColor }]}>Kabul Et</Text>
                </TouchableOpacity>
              )}

              {selectedConnection?.status === 'PENDING' && (
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleDecline}
                  disabled={actionLoading}
                >
                  <X size={20} color="#FFA500" />
                  <Text style={[styles.actionText, { color: theme.textColor }]}>Reddet</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.actionItem}
                onPress={handleBlock}
                disabled={actionLoading}
              >
                <Ban size={20} color="#ff6b6b" />
                <Text style={[styles.actionText, { color: '#ff6b6b' }]}>Engelle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={handleDelete}
                disabled={actionLoading}
              >
                <Trash2 size={20} color="#ff6b6b" />
                <Text style={[styles.actionText, { color: '#ff6b6b' }]}>Sil</Text>
              </TouchableOpacity>
            </View>

            {actionLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={theme.activeMenuColor} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
    position: 'relative',
  },
  cardContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardEmail: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  companyLogo: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  cardCompany: {
    fontSize: 13,
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 11,
    textAlign: 'center',
  },
  moreButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  moreIcon: {
    gap: 3,
    alignItems: 'center',
  },
  moreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  actionModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionList: {
    padding: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
