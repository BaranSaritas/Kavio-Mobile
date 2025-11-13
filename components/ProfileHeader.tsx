import { Edit, QrCode } from "lucide-react-native";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
}

export default function ProfileHeader({ editMode, setEditMode }: ProfileHeaderProps) {
  const [profile, setProfile] = useState({
    name: "Sedanur",
    surname: "Şahintaş",
    title: "Graphic Designer",
  });

  return (
    <View style={styles.header}>
      <View style={styles.bannerContainer}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.banner}
        />

        <View style={styles.avatarWrapper}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.avatar}
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => setEditMode(!editMode)}
            style={styles.iconBtn}
          >
            <Edit size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <QrCode size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.info}>
        {!editMode ? (
          <>
            <Text style={styles.name}>
              {profile.name} {profile.surname}
            </Text>
            <Text style={styles.title}>{profile.title}</Text>
          </>
        ) : (
          <View style={styles.editForm}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Soyad</Text>
              <TextInput
                style={styles.input}
                value={profile.surname}
                onChangeText={(text) => setProfile({ ...profile, surname: text })}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Unvan</Text>
              <TextInput
                style={styles.input}
                value={profile.title}
                onChangeText={(text) => setProfile({ ...profile, title: text })}
                placeholderTextColor="#666"
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  bannerContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  banner: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -45,
    left: 24,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#101417",
    overflow: "hidden",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  info: {
    marginTop: 60,
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  title: {
    fontSize: 14,
    color: "#bbb",
  },
  actions: {
    position: "absolute",
    right: 15,
    bottom: 15,
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    backgroundColor: "#1c1f24",
    padding: 8,
    borderRadius: 10,
  },
  editForm: {
    width: "100%",
    paddingRight: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: "#999",
    fontSize: 13,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#1c1f24",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2a2d32",
  },
});
