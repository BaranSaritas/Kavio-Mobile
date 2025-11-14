import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PublicMarketingAssetsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Medya & Pazarlama</Text>
        <Text style={styles.subtitle}>Bu sayfa yakında aktif olacak...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141e22',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A2A2A2',
    textAlign: 'center',
  },
});
