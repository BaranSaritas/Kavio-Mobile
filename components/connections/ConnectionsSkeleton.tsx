import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ConnectionsSkeletonProps {
  cardCount?: number;
}

const ConnectionsSkeleton: React.FC<ConnectionsSkeletonProps> = ({ cardCount = 6 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: cardCount }).map((_, index) => (
        <View key={index} style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.avatar} />
            <View style={styles.textContainer}>
              <View style={styles.textLarge} />
              <View style={styles.textSmall} />
            </View>
          </View>
          <View style={styles.controls}>
            <View style={styles.button} />
            <View style={styles.button} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  cardContainer: {
    width: width > 768 ? '31%' : width > 500 ? '47%' : '100%',
    margin: 5,
  },
  card: {
    backgroundColor: '#1a2428',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#2a3438',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2a3438',
    marginBottom: 12,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  textLarge: {
    width: '80%',
    height: 16,
    backgroundColor: '#2a3438',
    borderRadius: 4,
    marginBottom: 8,
  },
  textSmall: {
    width: '60%',
    height: 12,
    backgroundColor: '#2a3438',
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a3438',
  },
});

export default ConnectionsSkeleton;
