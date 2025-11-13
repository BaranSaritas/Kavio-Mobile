import InfoSection from "@/components/InfoSection";
import LinkSection from "@/components/LinkSection";
import ProfileHeader from "@/components/ProfileHeader";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const [editMode, setEditMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader editMode={editMode} setEditMode={setEditMode} />
      <InfoSection editMode={editMode} />
      <LinkSection editMode={editMode} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101417",
  },
});
