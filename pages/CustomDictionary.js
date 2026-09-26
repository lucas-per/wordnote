import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import { getCustomWords, deleteCustomWord } from "../lib/customDictDB";
import { languages } from "../languages";
import AddIcon from "../assets/icons/Add";
import TrashIcon from "../assets/icons/Trash";
import ConfirmDialog from "../components/ConfirmDialog";

const langLabel = (code) =>
  languages.find((l) => l.code === code)?.label || code;

export default function CustomDictionary({ navigation }) {
  const { colors } = useTheme();
  const [words, setWords] = useState([]);
  const [filterLang, setFilterLang] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadWords = useCallback(async () => {
    const list = await getCustomWords();
    setWords(list);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadWords);
    return unsubscribe;
  }, [navigation, loadWords]);

  const availableLangs = [...new Set(words.map((w) => w.lang))];
  const filteredWords =
    filterLang === "all" ? words : words.filter((w) => w.lang === filterLang);

  const handleDeleteConfirm = async () => {
    if (pendingDelete) {
      await deleteCustomWord(pendingDelete);
      loadWords();
    }
    setPendingDelete(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {availableLangs.length > 1 && (
        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => setFilterLang("all")}
            style={[
              styles.chip,
              {
                borderColor: colors.border,
                backgroundColor:
                  filterLang === "all" ? colors.primary : "transparent",
              },
            ]}
          >
            <Text
              style={{ color: filterLang === "all" ? "#fff" : colors.text }}
            >
              Todos
            </Text>
          </TouchableOpacity>
          {availableLangs.map((code) => (
            <TouchableOpacity
              key={code}
              onPress={() => setFilterLang(code)}
              style={[
                styles.chip,
                {
                  borderColor: colors.border,
                  backgroundColor:
                    filterLang === code ? colors.primary : "transparent",
                },
              ]}
            >
              <Text
                style={{ color: filterLang === code ? "#fff" : colors.text }}
              >
                {langLabel(code)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {filteredWords.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Nenhuma palavra pessoal cadastrada ainda.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, { borderBottomColor: colors.border }]}
              onPress={() =>
                navigation.navigate("Settings.customDictAdd", { ...item })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.word, { color: colors.text }]}>
                  {item.word}
                  {item.partOfSpeech ? ` · ${item.partOfSpeech}` : ""}
                </Text>
                <Text
                  style={[styles.definition, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {item.definition}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPendingDelete(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <TrashIcon width={20} height={20} fill={colors.text} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("Settings.customDictAdd")}
      >
        <AddIcon width={24} height={24} fill="#fff" />
      </TouchableOpacity>

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Excluir palavra"
        description="Essa palavra será removida do seu dicionário pessoal."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: "iA Writer Quattro",
    textAlign: "center",
    opacity: 0.7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  word: {
    fontFamily: "iA Writer Quattro",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  definition: {
    fontFamily: "iA Writer Quattro",
    fontSize: 14,
    opacity: 0.7,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
