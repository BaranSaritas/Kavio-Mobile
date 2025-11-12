import { Tabs } from "expo-router";
import { House } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#101417",
          borderTopColor: "#222",
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color }) => <House color={color} size={22} />,
        }}
      />

    </Tabs>
  );
}
