import { Mail, MapPin, Phone, Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface InfoSectionProps {
  editMode: boolean;
}

interface ContactItem {
  id: string;
  type: "phone" | "mail" | "location";
  value: string;
  icon: any;
}

export default function InfoSection({ editMode }: InfoSectionProps) {
  const [contacts, setContacts] = useState<ContactItem[]>([
    { id: "1", type: "phone", value: "+90 536 550 67 00", icon: Phone },
    { id: "2", type: "phone", value: "+90 536 550 35 61", icon: Phone },
    { id: "3", type: "phone", value: "+90 536 550 6700", icon: Phone },
    { id: "4", type: "mail", value: "sedanursahintas@gmail.com", icon: Mail },
    { id: "5", type: "location", value: "Menemen - İzmir", icon: MapPin },
  ]);

  const deleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>

      {editMode && (
        <View style={styles.addButtonsContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Mobil</Text>
            <Plus size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Whatsapp</Text>
            <Plus size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Mail</Text>
            <Plus size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Konum</Text>
            <Plus size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Fax</Text>
            <Plus size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Link</Text>
            <Plus size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {contacts.map((contact) => {
        const IconComponent = contact.icon;
        return (
          <View key={contact.id} style={styles.item}>
            <View style={styles.itemLeft}>
              <IconComponent color="#fff" size={18} />
              <Text style={styles.text}>{contact.value}</Text>
            </View>
            {editMode && (
              <TouchableOpacity
                onPress={() => deleteContact(contact.id)}
                style={styles.deleteButton}
              >
                <Trash2 size={18} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
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
  addButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
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
