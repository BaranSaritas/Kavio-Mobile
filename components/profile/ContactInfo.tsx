import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2 } from 'lucide-react-native';
import PageTitle from '../shared/PageTitle';
import { generateProfileIcon, linkData } from '../../utils/helpers';
import { setProfileData } from '../../redux/slices/ProfileSlice';
import { RootState } from '../../redux/store';

export default function ContactInfo() {
  const dispatch = useDispatch();
  const { isLoading, data } = useSelector((state: RootState) => state.profile);

  const handleContactInfoChange = (idx: number, newValue: string) => {
    const updated = data?.contactInfos?.map((item: any, i: number) =>
      i === idx ? { ...item, value: newValue } : item
    );
    dispatch(setProfileData({ ...data, contactInfos: updated }));
  };

  const handleAddFormItem = (contactType: string) => {
    dispatch(
      setProfileData({
        ...data,
        contactInfos: [
          ...(Array.isArray(data?.contactInfos) ? data.contactInfos : []),
          {
            contactType,
            value: '',
          },
        ],
      })
    );
  };

  const handleClickDeleteItem = (index: number) => {
    const updatedContactInfos = (data?.contactInfos || []).filter(
      (_: any, i: number) => i !== index
    );
    dispatch(
      setProfileData({
        ...data,
        contactInfos: updatedContactInfos,
      })
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7196AC" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Veri bulunamadı</Text>
      </View>
    );
  }

  return (
    <>
      <PageTitle title="İletişim Bilgileri" />
      <View style={styles.container}>
        {/* Add Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.addButtonsContainer}
          contentContainerStyle={styles.addButtonsContent}
        >
          {linkData?.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.addButton}
              onPress={() => handleAddFormItem(item?.contactType)}
            >
              <Text style={styles.addButtonText}>{item?.value}</Text>
              <Plus size={16} color="#7196AC" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Contact Info List */}
        {data?.contactInfos && data.contactInfos.length > 0 ? (
          data.contactInfos.map((item: any, idx: number) => {
            const IconComponent = generateProfileIcon(item?.contactType);
            return (
              <View key={idx} style={styles.formGroupWithDelete}>
                <View style={styles.formGroupInner}>
                  {IconComponent && <IconComponent size={20} color="#7196AC" />}
                  <TextInput
                    style={styles.input}
                    value={item?.value || ''}
                    onChangeText={(text) => handleContactInfoChange(idx, text)}
                    placeholder="Değer girin"
                    placeholderTextColor="#666"
                  />
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleClickDeleteItem(idx)}
                >
                  <Trash2 size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>İletişim bilgisi bulunamadı. Yukarıdan ekleyebilirsiniz.</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#1B272C',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  addButtonsContainer: {
    marginBottom: 20,
  },
  addButtonsContent: {
    gap: 10,
    paddingRight: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10181B',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7196AC',
  },
  formGroupWithDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  formGroupInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#273034',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  noDataText: {
    fontSize: 15,
    color: '#8E8E8E',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
