import { Tabs } from 'expo-router';
import { User, Share2, Building2, ImageIcon } from 'lucide-react-native';

export default function PublicProfileLayout() {
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
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
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
          title: 'Medya',
          tabBarIcon: ({ color, size }) => <ImageIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
