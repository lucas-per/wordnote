import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import Chevron from "../assets/icons/Chevron";

// Campo de seleção simples (estilo dropdown), sem dependência nativa
// nenhuma — abre uma lista em Modal, igual ao ConfirmDialog.
function SelectField({ label, value, placeholder, options, onSelect }) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.field, { borderColor: colors.border }]}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[
            styles.fieldText,
            { color: value ? colors.text : colors.border },
          ]}
        >
          {value || placeholder}
        </Text>
        <Chevron width={16} height={16} fill={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.card, { backgroundColor: colors.backgroundLevel2 }]}
            onPress={() => {}}
          >
            <Text style={[styles.title, { color: colors.text }]}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      item === value && { color: colors.primary },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldText: {
    fontFamily: "iA Writer Quattro",
    fontSize: 16,
    lineHeight: 20,
    includeFontPadding: false,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    maxHeight: "70%",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontFamily: "iA Writer Quattro",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 20,
    includeFontPadding: false,
    marginBottom: 12,
  },
  list: {
    flexGrow: 0,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionText: {
    fontFamily: "iA Writer Quattro",
    fontSize: 15,
    lineHeight: 19,
    includeFontPadding: false,
  },
});

export default SelectField;
