import { Link } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function LinkSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Linkler</Text>

      <View style={styles.item}>
        <Link color="#fff" size={18} />
        <Text style={styles.text}>sedanursahintas.com.tr</Text>
      </View>

      <View style={styles.item}>
        <Link color="#fff" size={18} />
        <Text style={styles.text}>kavio.com.tr</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 40,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 10,
    backgroundColor: "#1c1f24",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    gap: 10,
  },
  text: {
    color: "#eee",
    fontSize: 15,
  },
});
