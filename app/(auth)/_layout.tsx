import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function AuthLayout() {
  const { isAuthenticated, isHydrated } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      // Eğer kullanıcı giriş yapmışsa ana sayfaya yönlendir
      router.replace('/(tabs)/profile');
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#141e22' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register/[uniqueId]" />
    </Stack>
  );
}
