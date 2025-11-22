import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function attachAuthToken(config) {
  try {
    // Other profile management API'leri için token gönderme (public API'ler)
    if (config.url?.includes('/other-profile-management/')) {
      return config;
    }

    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error attaching auth token:', error);
    return config;
  }
}
