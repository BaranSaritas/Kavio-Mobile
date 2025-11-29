import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import ConnectionsScreen from './connections';
import ContactsScreen from './contacts';

export default function VisitorsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'contacts' | 'connections'>('contacts');

  const topPadding = Platform.OS === 'android' 
    ? (StatusBar.currentHeight || 0) + 10 
    : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: topPadding, backgroundColor: theme.menuBackgroundColor }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.activeMenuBackgroundColor }]} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Visitors</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tab, 
              activeTab === 'contacts' && [styles.activeTab, { borderBottomColor: theme.activeMenuColor }]
            ]}
            onPress={() => setActiveTab('contacts')}
          >
            <Text
              style={[
                styles.tabText, 
                { color: theme.labelColor },
                activeTab === 'contacts' && { color: theme.activeMenuColor }
              ]}
            >
              Contacts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab, 
              activeTab === 'connections' && [styles.activeTab, { borderBottomColor: theme.activeMenuColor }]
            ]}
            onPress={() => setActiveTab('connections')}
          >
            <Text
              style={[
                styles.tabText, 
                { color: theme.labelColor },
                activeTab === 'connections' && { color: theme.activeMenuColor }
              ]}
            >
              Connections
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'contacts' ? <ContactsScreen /> : <ConnectionsScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});
