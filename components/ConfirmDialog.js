import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.card, { backgroundColor: colors.backgroundLevel2 }]}
          onPress={() => {}}
        >
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {description}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={[styles.buttonText, { color: colors.text }]}>
                {cancelLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={[styles.buttonText, styles.destructiveText]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontFamily: "iA Writer Quattro",
    fontWeight: "600",
    fontSize: 17,
    marginBottom: 8,
  },
  description: {
    fontFamily: "iA Writer Quattro",
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  buttonText: {
    fontFamily: "iA Writer Quattro",
    fontSize: 15,
    fontWeight: "600",
  },
  destructiveText: {
    color: "rgb(236,94,65)",
  },
});

export default ConfirmDialog;
