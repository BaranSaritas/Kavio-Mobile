import { Tabs } from "expo-router";
import { Building2, ImageIcon, Share2, User } from "lucide-react-native";

export default function TabsLayout() {
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
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {/* Hidden screens */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="charts" options={{ href: null }} />
      <Tabs.Screen name="connections" options={{ href: null }} />
      <Tabs.Screen name="contact" options={{ href: null }} />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="social-media"
        options={{
          title: 'Social Media',
          tabBarIcon: ({ color, size }) => <Share2 color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="company"
        options={{
          title: 'Company',
          tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="marketing-assets"
        options={{
          title: 'Marketing Assets',
          tabBarIcon: ({ color, size }) => <ImageIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
