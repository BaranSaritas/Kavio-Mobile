import InfoSection from "@/components/InfoSection";
import LinkSection from "@/components/LinkSection";
import ProfileHeader from "@/components/ProfileHeader";
import { ScrollView, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <ProfileHeader />
      <InfoSection />
      <LinkSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101417",
  },
});
