import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";

import CloseIcon from "../assets/icons/Close";

// Card de dica que aparece uma vez e, ao ser fechado, nunca mais
// aparece (flag persistida em AsyncStorage por `storageKey`).
function DismissibleTip({ storageKey, title, description }) {
  const { colors } = useTheme();
  const [dismissed, setDismissed] = useState(true); // começa oculto até checar o storage

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(storageKey).then((value) => {
      if (mounted) setDismissed(value === "true");
    });
    return () => {
      mounted = false;
    };
  }, [storageKey]);

  const handleClose = () => {
    setDismissed(true);
    AsyncStorage.setItem(storageKey, "true");
  };

  if (dismissed) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundLevel2 },
      ]}
    >
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {description}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleClose}
        style={styles.closeButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="Fechar dica"
        accessibilityRole="button"
      >
        <CloseIcon width={14} height={14} fill={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
  },
  textWrap: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontFamily: "iA Writer Quattro",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
  },
  description: {
    fontFamily: "iA Writer Quattro",
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.8,
  },
  // Área de toque de 32x32 (dentro da faixa pedida de 20–44px),
  // com o ícone visual menor (14px) centralizado dentro dela.
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DismissibleTip;
