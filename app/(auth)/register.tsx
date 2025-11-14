import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { register, userSliceReset } from '../../redux/slices/UserSlice';
import { AppDispatch, RootState } from '../../redux/store';

const getValidationSchema = (t: any) => {
  return Yup.object({
    name: Yup.string()
      .min(2, t('auth.register.validation.nameMin'))
      .required(t('auth.register.validation.nameRequired')),
    surname: Yup.string()
      .min(2, t('auth.register.validation.surnameMin'))
      .required(t('auth.register.validation.surnameRequired')),
    email: Yup.string()
      .email(t('auth.register.validation.emailInvalid'))
      .required(t('auth.register.validation.emailRequired')),
    password: Yup.string()
      .min(6, t('auth.register.validation.passwordMin'))
      .required(t('auth.register.validation.passwordRequired')),
  });
};

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isError, message } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const { uniqueId } = useLocalSearchParams();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const { errors, values, handleSubmit, touched, handleBlur, handleChange } =
    useFormik({
      initialValues: {
        name: '',
        surname: '',
        email: '',
        password: '',
      },
      validationSchema: getValidationSchema(t),
      onSubmit: async (values) => {
        if (values?.email && values?.password && values?.name && values?.surname) {
          try {
            const res = await dispatch(
              register({ 
                registerData: values, 
                uniqueId: uniqueId as string 
              })
            ).unwrap();
            
            Toast.show({
              type: 'success',
              text1: t('auth.register.successMessage'),
            });
            
            setTimeout(() => {
              router.replace({
                pathname: '/profile',
                params: { email: values.email }
              });
            }, 2500);
          } catch (error) {
            console.error('Register error:', error);
          }
        }
      },
    });

  useEffect(() => {
    if (isError && message) {
      Toast.show({
        type: 'error',
        text1: message,
      });
    }
    return () => {
      dispatch(userSliceReset());
    };
  }, [isError, message]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/kavio_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('auth.register.title')}</Text>
          </View>

          {/* Form Body */}
          <View style={styles.formBody}>
            {/* Name Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('auth.register.nameLabel')}</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.name && errors.name && styles.inputError,
                ]}
                placeholder={t('auth.register.namePlaceholder')}
                placeholderTextColor="#999"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Surname Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('auth.register.surnameLabel')}</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.surname && errors.surname && styles.inputError,
                ]}
                placeholder={t('auth.register.surnamePlaceholder')}
                placeholderTextColor="#999"
                value={values.surname}
                onChangeText={handleChange('surname')}
                onBlur={handleBlur('surname')}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {touched.surname && errors.surname && (
                <Text style={styles.errorText}>{errors.surname}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('auth.register.emailLabel')}</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.email && errors.email && styles.inputError,
                ]}
                placeholder="email@example.com"
                placeholderTextColor="#999"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('auth.register.passwordLabel')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    touched.password && errors.password && styles.inputError,
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#999" />
                  ) : (
                    <Eye size={20} color="#999" />
                  )}
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={() => handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>{t('auth.register.submitText')}</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                {t('auth.register.hasAccountText')}
              </Text>
              <TouchableOpacity onPress={() => router.push('../login')}>
                <Text style={styles.loginLink}>
                  {t('auth.register.loginLink')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    paddingVertical: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 35,
    width: 150,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  formBody: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#999',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputError: {
    backgroundColor: '#2a1a1a',
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 15,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff6b6b',
    marginTop: 8,
  },
  submitButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  loginText: {
    fontSize: 15,
    color: '#999',
  },
  loginLink: {
    fontSize: 15,
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default Register;
