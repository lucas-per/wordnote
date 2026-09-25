import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import TrashIcon from "../assets/icons/Trash";

function HiddenItem({ onDelete }) {
  return (
    <TouchableOpacity
      style={styles.rowBack}
      onPress={onDelete}
      accessibilityLabel="Excluir caderno"
      accessibilityRole="button"
    >
      <TrashIcon fill="#fff" width={20} height={20} />
    </TouchableOpacity>
  );
}

export default React.forwardRef((props, ref) => (
  <HiddenItem innerRef={ref} {...props} />
));

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgb(236,94,65)",
    paddingRight: 28,
  },
});
