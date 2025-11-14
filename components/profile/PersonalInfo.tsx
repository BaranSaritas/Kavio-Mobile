import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from '../../redux/slices/ProfileSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { generateProfileIcon } from '../../utils/helpers';
import PageTitle from '../shared/PageTitle';

interface PersonalInfoProps {
  isUpdated: boolean;
}

export default function PersonalInfo({ isUpdated }: PersonalInfoProps) {
  const dispatch = useDispatch<AppDispatch>();
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

  const handleChange = (name: string, value: string) => {
      if (!data) return;
    dispatch(
      setProfileData({
        ...data,
        userInfo: { ...data.userInfo, [name]: value },
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

  return (
    <>
      <PageTitle title="Kişisel Bilgiler" />
      <View style={styles.container}>
        {isUpdated ? (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ad</Text>
              <TextInput
                style={styles.input}
                value={data?.userInfo?.firstName || ''}
                onChangeText={(text) => handleChange('firstName', text)}
                placeholder="Adınız"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Soyad</Text>
              <TextInput
                style={styles.input}
                value={data?.userInfo?.lastName || ''}
                onChangeText={(text) => handleChange('lastName', text)}
                placeholder="Soyadınız"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ünvan</Text>
              <TextInput
                style={styles.input}
                value={data?.userInfo?.bio || ''}
                onChangeText={(text) => handleChange('bio', text)}
                placeholder="Ünvanınız"
                placeholderTextColor="#666"
              />
            </View>
          </>
        ) : (
          data?.contactInfos?.map((item: any, idx: number) => {
            const IconComponent = generateProfileIcon(item?.contactType);
            return (
              <View key={idx} style={styles.copiedLine}>
                <View style={styles.copiedLineGroup}>
                  {IconComponent && <IconComponent size={20} color="#7196AC" />}
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
            );
          })
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8E8E8E',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#273034',
    color: '#ffffff',
    paddingHorizontal: 15,
    fontSize: 16,
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
});
