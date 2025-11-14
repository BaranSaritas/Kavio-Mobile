import { useRouter } from 'expo-router';
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
import { getUserInfo, login, userSliceReset } from '../../redux/slices/UserSlice';
import { AppDispatch, RootState } from '../../redux/store';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçerli bir email giriniz')
    .required('Email zorunludur'),

  password: Yup.string()
    .required('Şifre zorunludur'),
});

export default function LoginScreen() {
const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const { isLoading, isError, message } = useSelector((state: RootState) => state.user);

  const { errors, values, handleSubmit, touched, handleBlur, handleChange, setFieldValue } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      if (values?.email && values?.password) {
        try {
          const loginRes = await dispatch(login(values)).unwrap();
          if (loginRes?.accessToken) {
            Toast.show({
              type: 'success',
              text1: 'Giriş Başarılı',
              text2: 'Hoş geldiniz! 🎉',
            });
            await dispatch(getUserInfo()).unwrap();
            router.replace('/(tabs)/profile');
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
  }, [isError, message]);

  useEffect(() => {
    return () => {
      dispatch(userSliceReset());
    };
  }, [dispatch]);

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
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Giriş Yap</Text>
            <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>
          </View>

          {/* Form Body */}
          <View style={styles.formBody}>
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

            {/* Forgot Password */}
            <View style={styles.forgotContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
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
                <Text style={styles.buttonText}>Giriş Yap</Text>
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
    justifyContent: 'center',
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
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#A2A2A2',
    textAlign: 'center',
    marginTop: 5,
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
  forgotContainer: {
    alignItems: 'flex-end',
  },
  forgotText: {
    color: '#3C616D',
    fontSize: 15,
    fontWeight: '500',
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#3C616D',
    justifyContent: 'center',
    alignItems: 'center',
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
