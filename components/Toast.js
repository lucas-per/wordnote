import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

// Toast simples, sem dependências externas, que segue as cores do
// tema ativo (claro/escuro). `trigger` é um valor que muda toda vez
// que o toast deve reaparecer (ex: Date.now()).
function Toast({ message, trigger }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimeout = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    if (hideTimeout.current) clearTimeout(hideTimeout.current);

    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();

    hideTimeout.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [trigger]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity,
          backgroundColor: colors.backgroundLevel2,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.text }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 24,
    right: 24,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  text: {
    fontSize: 15,
    textAlign: "center",
  },
});

export default Toast;
