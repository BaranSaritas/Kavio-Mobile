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

const { width } = Dimensions.get('window');

export default function ConnectionsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const { data: connections, isLoading, actionLoading } = useSelector(
    (state: RootState) => state.connections
  );
  const cardId = user?.cardId;

  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  // Responsive columns
  const numColumns = width > 768 ? 3 : width > 500 ? 2 : 1;

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
        return <CheckCircle size={16} color="#70C094" />;
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
        style={[styles.card, { width: width / numColumns - 20 }]}
        onPress={() => handleConnectionPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {otherUser.firstName?.charAt(0)?.toUpperCase() || 
                 otherUser.lastName?.charAt(0)?.toUpperCase() || 
                 'U'}
              </Text>
            </View>
          )}

          <Text style={styles.cardName} numberOfLines={1}>
            {fullName}
          </Text>
          
          {email && email !== fullName && (
            <Text style={styles.cardEmail} numberOfLines={1}>
              {email}
            </Text>
          )}
          
          {/* Company Info */}
          {companyName && (
            <View style={styles.companyRow}>
              {companyLogo && (
                <Image source={{ uri: companyLogo }} style={styles.companyLogo} />
              )}
              <Text style={styles.cardCompany} numberOfLines={1}>
                {companyName}
              </Text>
            </View>
          )}

          {/* Status Badge */}
          <View style={styles.statusBadge}>
            {getStatusIcon(item.status)}
            <Text style={[styles.statusText, getStatusStyle(item.status)]}>
              {getStatusText(item.status)}
            </Text>
          </View>

          <Text style={styles.cardDate}>
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
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return { color: '#70C094' };
      case 'PENDING':
        return { color: '#FFA500' };
      case 'DECLINED':
      case 'BLOCKED':
        return { color: '#ff6b6b' };
      default:
        return { color: '#A2A2A2' };
    }
  };

  if (isLoading && connections.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7196AC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Empty State */}
      {connections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Users size={48} color="#444" />
          <Text style={styles.emptyText}>No connections yet</Text>
          <Text style={styles.emptySubtext}>
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
              tintColor="#7196AC"
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
          <View style={styles.actionModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İşlemler</Text>
              <TouchableOpacity onPress={() => setShowActionModal(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionList}>
              {selectedConnection?.status === 'PENDING' && (
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleAccept}
                  disabled={actionLoading}
                >
                  <Check size={20} color="#70C094" />
                  <Text style={styles.actionText}>Kabul Et</Text>
                </TouchableOpacity>
              )}

              {selectedConnection?.status === 'PENDING' && (
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleDecline}
                  disabled={actionLoading}
                >
                  <X size={20} color="#FFA500" />
                  <Text style={styles.actionText}>Reddet</Text>
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
                <ActivityIndicator size="large" color="#7196AC" />
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
    backgroundColor: '#141e22',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#141e22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#1B272C',
    borderRadius: 12,
    padding: 16,
    margin: 5,
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
    backgroundColor: '#273034',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#7196AC',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardEmail: {
    fontSize: 12,
    color: '#A2A2A2',
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
    color: '#7196AC',
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#273034',
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
    color: '#666',
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
    backgroundColor: '#8E8E8E',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  actionModal: {
    backgroundColor: '#1B272C',
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
    borderBottomColor: '#273034',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
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
    color: '#fff',
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
