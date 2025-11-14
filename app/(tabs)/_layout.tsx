import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { User, Building2, Share2, ImageIcon } from 'lucide-react-native';
import { RootState } from '../../redux/store';

export default function TabsLayout() {
  const { isAuthenticated, isHydrated } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7196AC',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1B272C',
          borderTopColor: '#273034',
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="social-media"
        options={{
          title: 'Sosyal Medya',
          tabBarIcon: ({ color, size }) => <Share2 color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="company"
        options={{
          title: 'Şirket',
          tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="marketing-assets"
        options={{
          title: 'Katalog',
          tabBarIcon: ({ color, size }) => <ImageIcon color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="charts"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="connections"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="contact"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
