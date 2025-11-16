import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConnectionsScreen from './connections';
import ContactsScreen from './contacts';

export default function VisitorsLayout() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'connections'>('contacts');

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Visitors',
          headerStyle: {
            backgroundColor: '#1B272C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      />
      <View style={styles.container}>
        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'contacts' && styles.activeTab]}
            onPress={() => setActiveTab('contacts')}
          >
            <Text
              style={[styles.tabText, activeTab === 'contacts' && styles.activeTabText]}
            >
              Contacts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'connections' && styles.activeTab]}
            onPress={() => setActiveTab('connections')}
          >
            <Text
              style={[styles.tabText, activeTab === 'connections' && styles.activeTabText]}
            >
              Connections
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'contacts' ? <ContactsScreen /> : <ConnectionsScreen />}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141e22',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1B272C',
    borderBottomWidth: 1,
    borderBottomColor: '#273034',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#7196AC',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E8E',
  },
  activeTabText: {
    color: '#7196AC',
  },
  content: {
    flex: 1,
  },
});
