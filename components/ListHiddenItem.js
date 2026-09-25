import React from "react";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";

import TrashIcon from "../assets/icons/Trash";

// Ícone 2x maior que o original (era 20x20, agora 40x40)
const ICON_SIZE = 40;

function HiddenItem({ onDelete, swipeValue, maxWidth }) {
  // O ícone acompanha o arrasto (efeito de paralaxe): começa escondido
  // fora da área revelada e vai se centralizando conforme a caixa
  // cresce, até ficar parado no centro quando atinge a largura máxima.
  const translateX = swipeValue
    ? swipeValue.interpolate({
        inputRange: [0, maxWidth],
        outputRange: [0, maxWidth / 2 - ICON_SIZE / 2],
        extrapolate: "clamp",
      })
    : 0;

  return (
    <TouchableOpacity
      style={styles.rowBack}
      onPress={onDelete}
      activeOpacity={0.85}
      accessibilityLabel="Excluir caderno"
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.iconWrap,
          { width: ICON_SIZE },
          swipeValue && { transform: [{ translateX }] },
        ]}
      >
        <TrashIcon fill="#fff" width={ICON_SIZE} height={ICON_SIZE} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default HiddenItem;

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    backgroundColor: "rgb(236,94,65)",
  },
  iconWrap: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
