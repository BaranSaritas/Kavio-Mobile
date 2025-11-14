import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import PageTitle from '../shared/PageTitle';
import { setProfileData } from '../../redux/slices/ProfileSlice';
import { RootState } from '../../redux/store';

interface LinksProps {
  isUpdated: boolean;
}

export default function Links({ isUpdated }: LinksProps) {
  const dispatch = useDispatch();
  const { isLoading, data } = useSelector((state: RootState) => state.profile);
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = async (id: number, textToCopy: string) => {
    try {
      await Clipboard.setStringAsync(textToCopy);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const handleAddFormItem = () => {
    dispatch(
      setProfileData({
        ...data,
        links: [
          ...(data?.links || []),
          {
            position: (data?.links?.length || 0) + 1,
            title: 'UNKNOWN',
            value: '',
          },
        ],
      })
    );
  };

  const handleClickDeleteItem = (id: number) => {
    const updatedLinks = (data?.links || []).filter((el: any) => el.id !== id);
    dispatch(
      setProfileData({
        ...data,
        links: updatedLinks,
      })
    );
  };

  const handleInputChange = (idx: number, newValue: string) => {
    const updatedLinks = [...(data?.links || [])].map((link: any, index: number) =>
      index === idx ? { ...link, value: newValue } : link
    );
    dispatch(setProfileData({ ...data, links: updatedLinks }));
  };

  const sortLinksByPosition = (links: any[] = []) =>
    [...links].sort((a, b) => (a.position || 0) - (b.position || 0));

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

  const sortedLinks = sortLinksByPosition(data?.links || []);

  return (
    <>
      <PageTitle title="Linkler" />
      <View style={styles.container}>
        {isUpdated ? (
          <>
            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddFormItem}>
              <Text style={styles.addButtonText}>Link</Text>
              <Plus size={16} color="#7196AC" />
            </TouchableOpacity>

            {/* Links List */}
            {sortedLinks && sortedLinks.length > 0 ? (
              sortedLinks.map((item: any, idx: number) => (
                <View key={idx} style={styles.formGroupWithDelete}>
                  <View style={styles.formGroupInner}>
                    <LinkIcon size={20} color="#7196AC" />
                    <TextInput
                      style={styles.input}
                      value={item?.value || ''}
                      onChangeText={(text) => handleInputChange(idx, text)}
                      placeholder="Link girin"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleClickDeleteItem(item?.id)}
                  >
                    <Trash2 size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Link bulunamadı. Yukarıdan ekleyebilirsiniz.</Text>
            )}
          </>
        ) : (
          <>
            {sortedLinks && sortedLinks.length > 0 ? (
              sortedLinks.map((item: any, idx: number) => (
                <View key={idx} style={styles.copiedLine}>
                  <View style={styles.copiedLineGroup}>
                    <LinkIcon size={20} color="#7196AC" />
                    <Text style={styles.copiedLineText}>{item?.value}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => handleCopy(item?.id, item?.value)}
                  >
                    {copied === item?.id ? (
                      <Check size={18} color="#70C094" />
                    ) : (
                      <Copy size={18} color="#A2A2A2" />
                    )}
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Link bulunamadı</Text>
            )}
          </>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10181B',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
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
  copiedLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: '#32424A',
    borderRadius: 8,
    marginBottom: 10,
  },
  copiedLineGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  copiedLineText: {
    fontSize: 15,
    color: '#ffffff',
    flex: 1,
  },
  copyButton: {
    padding: 8,
  },
  noDataText: {
    fontSize: 15,
    color: '#8E8E8E',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
