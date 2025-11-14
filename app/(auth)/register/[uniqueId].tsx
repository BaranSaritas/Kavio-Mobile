import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { Eye, EyeOff } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
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
import * as Yup from 'yup';
import { register, userSliceReset } from '../../../redux/slices/UserSlice';
import { AppDispatch, RootState } from '../../../redux/store';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Ad zorunludur'),
  surname: Yup.string().required('Soyad zorunludur'),
  email: Yup.string().email('Geçerli bir email giriniz').required('Email zorunludur'),
  password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
});

export default function RegisterScreen() {
const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { uniqueId } = useLocalSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  
  const { isLoading, isError, message } = useSelector((state: RootState) => state.user);

  const { errors, values, handleSubmit, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      if (values?.email && values?.password && values?.name && values?.surname) {
        try {
          const res = await dispatch(
            register({ registerData: values, uniqueId: uniqueId as string })
          );
          if (res?.meta?.requestStatus === 'fulfilled') {
            Toast.show({
              type: 'success',
              text1: 'Kayıt Başarılı',
              text2: 'Giriş sayfasına yönlendiriliyorsunuz...',
            });
            setTimeout(() => {
              router.replace({
                pathname: '/(auth)/login',
                params: { email: values?.email }
              });
            }, 2500);
          }
        } catch (error) {
          // Error handled by interceptor
        }
      }
    },
  });

  useEffect(() => {
    if (isError && message) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: message,
      });
    }
    return () => {
      dispatch(userSliceReset());
    };
  }, [dispatch, isError, message]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Kayıt Ol</Text>
          </View>

          {/* Form Body */}
          <View style={styles.formBody}>
            {/* Name Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ad</Text>
              <TextInput
                style={styles.input}
                placeholder="Adınız"
                placeholderTextColor="#666"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}
            </View>

            {/* Surname Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Soyad</Text>
              <TextInput
                style={styles.input}
                placeholder="Soyadınız"
                placeholderTextColor="#666"
                value={values.surname}
                onChangeText={handleChange('surname')}
                onBlur={handleBlur('surname')}
              />
              {touched.surname && errors.surname && (
                <Text style={styles.error}>{errors.surname}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#A2A2A2" />
                  ) : (
                    <Eye size={18} color="#A2A2A2" />
                  )}
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={() => handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141e22',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 35,
  },
  logo: {
    height: 50,
    width: 150,
  },
  formContainer: {
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  formBody: {
    gap: 20,
  },
  formGroup: {
    gap: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#A2A2A2',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#273034',
    color: '#A2A2A2',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  error: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff6b6b',
    marginTop: 5,
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#3C616D',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
