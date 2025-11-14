import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export default function FullScreenLoader() {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.85,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Glow effect + Logo */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image
          source={require("../assets/images/icon.png")} // KAVIO LOGO BURAYA
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Modern Loading Text */}
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        KAVIO yükleniyor...
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141e22",
    justifyContent: "center",
    alignItems: "center",
  },

  logoWrapper: {
    width: 130,
    height: 130,
    backgroundColor: "rgba(60, 97, 109, 0.15)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3C616D",
    shadowOpacity: 0.7,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },

  logo: {
    width: 90,
    height: 90,
  },

  text: {
    marginTop: 25,
    fontSize: 17,
    letterSpacing: 1,
    color: "#A2A2A2",
    fontWeight: "600",
  },
});
