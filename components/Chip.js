import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

// Chip reutilizável (seletor tipo "pill"), usado em filtros e seleções
// de opção única (ex: idioma). O ajuste de fonte pro Android (padding
// extra de fonte com fontes customizadas) já vem embutido aqui, então
// qualquer novo uso de chip no app herda a correção automaticamente.
function Chip({ label, active, onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: colors.border,
          backgroundColor: active ? colors.primary : "transparent",
        },
      ]}
    >
      <Text
        style={[styles.text, { color: active ? "#fff" : colors.text }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontFamily: "iA Writer Quattro",
    fontSize: 14,
    lineHeight: 18,
    includeFontPadding: false,
  },
});

export default Chip;
