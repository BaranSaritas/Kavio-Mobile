  import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { resetGuestContact, sendGuestContact } from '../../redux/slices/GuestContactSlice';
import { AppDispatch, RootState } from '../../redux/store';

  interface GuestContactModalProps {
    visible: boolean;
    onClose: () => void;
    cardId?: string;
  }

  export default function GuestContactModal({ visible, onClose, cardId }: GuestContactModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.guestContact);

    const [formData, setFormData] = useState({
      nameSurname: '',
      email: '',
      phone: '',
      note: '',
      agreementChecked: false,
    });

    const [errors, setErrors] = useState({
      nameSurname: '',
      email: '',
      phone: '',
      note: '',
      agreement: '',
    });

    const validateForm = () => {
      const newErrors = {
        nameSurname: '',
        email: '',
        phone: '',
        note: '',
        agreement: '',
      };

      if (!formData.nameSurname.trim()) {
        newErrors.nameSurname = 'İsim soyisim gerekli';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'E-posta gerekli';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Geçerli bir e-posta girin';
      }

      const phoneRegex = /^[0-9]{10,11}$/;
      if (!formData.phone.trim()) {
        newErrors.phone = 'Telefon gerekli';
      } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Geçerli bir telefon numarası girin';
      }

      if (!formData.note.trim()) {
        newErrors.note = 'Mesaj gerekli';
      }

      if (!formData.agreementChecked) {
        newErrors.agreement = 'Kvkk şartlarını kabul etmelisiniz';
      }

      setErrors(newErrors);
      return !Object.values(newErrors).some((error) => error !== '');
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      if (!cardId) {
        Toast.show({
          type: 'error',
          text1: 'Hata',
          text2: 'Kart bilgisi bulunamadı',
        });
        return;
      }

      try {
        await dispatch(sendGuestContact({ cardId, data: formData })).unwrap();
        
        Toast.show({
          type: 'success',
          text1: 'Başarılı',
          text2: 'Mesajınız başarıyla gönderildi',
        });

        // Reset form
        setFormData({
          nameSurname: '',
          email: '',
          phone: '',
          note: '',
          agreementChecked: false,
        });
        
        dispatch(resetGuestContact());
        onClose();
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Hata',
          text2: error || 'Mesaj gönderilemedi',
        });
      }
    };

    return (
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>İletişime Geç</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Name Surname */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>İsim Soyisim *</Text>
                <TextInput
                  style={[styles.input, errors.nameSurname && styles.inputError]}
                  placeholder="İsminizi girin"
                  placeholderTextColor="#8E8E8E"
                  value={formData.nameSurname}
                  onChangeText={(text) => {
                    setFormData({ ...formData, nameSurname: text });
                    setErrors({ ...errors, nameSurname: '' });
                  }}
                />
                {errors.nameSurname ? <Text style={styles.errorText}>{errors.nameSurname}</Text> : null}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-posta *</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="ornek@email.com"
                  placeholderTextColor="#8E8E8E"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    setErrors({ ...errors, email: '' });
                  }}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefon *</Text>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder="05XXXXXXXXX"
                  placeholderTextColor="#8E8E8E"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => {
                    setFormData({ ...formData, phone: text });
                    setErrors({ ...errors, phone: '' });
                  }}
                />
                {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
              </View>

              {/* Note */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mesajınız *</Text>
                <TextInput
                  style={[styles.textArea, errors.note && styles.inputError]}
                  placeholder="Mesajınızı yazın..."
                  placeholderTextColor="#8E8E8E"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  value={formData.note}
                  onChangeText={(text) => {
                    setFormData({ ...formData, note: text });
                    setErrors({ ...errors, note: '' });
                  }}
                />
                {errors.note ? <Text style={styles.errorText}>{errors.note}</Text> : null}
              </View>

              {/* Agreement */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => {
                  setFormData({ ...formData, agreementChecked: !formData.agreementChecked });
                  setErrors({ ...errors, agreement: '' });
                }}
              >
                <View style={[styles.checkbox, formData.agreementChecked && styles.checkboxChecked]}>
                  {formData.agreementChecked && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.checkboxLabel}>KVKK şartlarını okudum ve kabul ediyorum</Text>
              </TouchableOpacity>
              {errors.agreement ? <Text style={styles.errorText}>{errors.agreement}</Text> : null}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Gönder</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#1B272C',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '90%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: '#fff',
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#273034',
      borderRadius: 10,
      padding: 14,
      color: '#fff',
      fontSize: 15,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    inputError: {
      borderColor: '#CD6060',
    },
    textArea: {
      backgroundColor: '#273034',
      borderRadius: 10,
      padding: 14,
      color: '#fff',
      fontSize: 15,
      height: 120,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    errorText: {
      color: '#CD6060',
      fontSize: 12,
      marginTop: 4,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: '#7196AC',
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#7196AC',
    },
    checkboxInner: {
      width: 10,
      height: 10,
      backgroundColor: '#fff',
      borderRadius: 2,
    },
    checkboxLabel: {
      fontSize: 13,
      color: '#D4D4D4',
      flex: 1,
    },
    submitBtn: {
      backgroundColor: '#7196AC',
      borderRadius: 10,
      padding: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    submitBtnDisabled: {
      opacity: 0.6,
    },
    submitBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
