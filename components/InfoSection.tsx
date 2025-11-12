import { Mail, MapPin, Phone } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function InfoSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

      <View style={styles.item}>
        <Phone color="#fff" size={18} />
        <Text style={styles.text}>+90 536 550 67 00</Text>
      </View>

      <View style={styles.item}>
        <Phone color="#fff" size={18} />
        <Text style={styles.text}>+90 536 550 35 61</Text>
      </View>

      <View style={styles.item}>
        <Phone color="#fff" size={18} />
        <Text style={styles.text}>+90 536 550 67 00</Text>
      </View>

      <View style={styles.item}>
        <Mail color="#fff" size={18} />
        <Text style={styles.text}>sedanursahintas35@gmail.com</Text>
      </View>

      <View style={styles.item}>
        <MapPin color="#fff" size={18} />
        <Text style={styles.text}>Menemen - İzmir</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
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
