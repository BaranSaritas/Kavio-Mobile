import { Link, Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LinkSectionProps {
  editMode: boolean;
}

interface LinkItem {
  id: string;
  url: string;
}

export default function LinkSection({ editMode }: LinkSectionProps) {
  const [links, setLinks] = useState<LinkItem[]>([
    { id: "1", url: "sedanursahintas.com.tr" },
    { id: "2", url: "kavio.com.tr" },
    { id: "3", url: "loremipsum.com.tr" },
  ]);

  const deleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Linkler</Text>

      {editMode && (
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Link</Text>
          <Plus size={16} color="#fff" />
        </TouchableOpacity>
      )}

      {links.map((link) => (
        <View key={link.id} style={styles.item}>
          <View style={styles.itemLeft}>
            <Link color="#fff" size={18} />
            <Text style={styles.text}>{link.url}</Text>
          </View>
          {editMode && (
            <TouchableOpacity
              onPress={() => deleteLink(link.id)}
              style={styles.deleteButton}
            >
              <Trash2 size={18} color="#ff4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1c1f24",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a2d32",
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 13,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
    paddingVertical: 4,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  text: {
    color: "#eee",
    fontSize: 15,
  },
  deleteButton: {
    padding: 4,
  },
});
