import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import { useKeepAwake } from "expo-keep-awake";
import { useTheme, CommonActions } from "@react-navigation/native";

import PartOfSpeech from "../components/PartOfSpeech";
import Meaning from "../components/Meaning";
import Toast from "../components/Toast";
import LanguageIcon from "../assets/icons/Language";
import CopyIcon from "../assets/icons/Copy";

import {
  getNoteContent,
  updateNoteContent,
  updateTitle,
  updateLang,
} from "../lib/appDB";
import { findCustomWord } from "../lib/customDictDB";

export default function Editor({
  navigation,
  route,
  langsDB,
  globalData,
  setGlobalData,
  i18n,
}) {
  const scrollParentInput = useRef(null);
  const scrollParentResult = useRef(null);
  const noteInput = useRef(null);
  const noteID = useRef(null);
  const db = useRef(null);
  const lastQuery = useRef(null);

  const defaultTitle = i18n.t("editor.defaultTitle");

  const [result, setResult] = useState(null);
  const [notFoundWord, setNotFoundWord] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [cursorPos, setCursorPos] = useState({ start: 0, end: 0 });
  const [title, setTitle] = useState("");
  const [toastTrigger, setToastTrigger] = useState(null);

  // Lang
  let langFromNote = globalData.filter((item) => item.id === noteID.current)[0]
    ?.lang;
  const [lang, setLang] = useState(langFromNote ? langFromNote : "en");

  // Hooks
  useKeepAwake();
  const { colors, dark } = useTheme();

  // --------------------------------------
  // Cycle
  // --------------------------------------
  useEffect(() => {
    if (route.params?.id) {
      noteID.current = route.params.id;
      lastQuery.current = null;
    }

    if (route.params?.title) {
      setTitle(route.params.title);
    }

    const fetchData = async () => {
      let c = await getNoteContent(noteID.current);
      setNoteContent(c);
    };

    fetchData();
  }, [route.params?.id]);

  useEffect(() => {
    if (route.params?.title) {
      setTitle(route.params.title);
    }
  }, [route.params.title]);

  // Save global state in the editor to keep the methods in the same file
  useEffect(() => {
    if (route.params?.lang) {
      console.log("CHANGE DB LANG", route.params.lang);
      db.current = langsDB.getDatabase(route.params.lang);

      setLang(route.params.lang);
    }

    if (route.params?.updateFromModal) {
      console.log("Update from modal");
      updateLang(noteID.current, route.params.lang);
      updateGlobalState();

      noteInput.current.blur();
      setResult(null);
    }
  }, [route.params.lang]);

  // --------------------------------------
  // Header

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => CommonActions.goBack()}>
          <View style={{ width: 30, height: 30 }}>
            <Chevron width={30} height={30} fill={colors.primary} />
          </View>
        </TouchableWithoutFeedback>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            width: 72,
            justifyContent: "space-between",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("Settings.languages", { lang });
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
              }}
            >
              <LanguageIcon width={24} height={24} fill={colors.primary} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={onCopyNote}>
            <View style={{ width: 30, height: 30 }}>
              <CopyIcon width={24} height={24} fill={colors.primary} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      ),
    });
  }, [navigation, lang]);

  // --------------------------------------
  // Core Functions
  // --------------------------------------
  function parseResult(c) {
    let obj = JSON.parse(c);

    if (obj._array.length <= 0) {
      setResult(null);
      return;
    }

    let meanings = JSON.parse(obj._array[0].meanings);
    let phonetics = JSON.parse(obj._array[0].phonetics);

    // Sort to noun first than verb
    // TODO: Adapt to other languages
    meanings.sort((a, b) => a.partOfSpeech.localeCompare(b.partOfSpeech));

    return meanings.map((o, i) => {
      return (
        <View key={obj._array[0].word + i}>
          <PartOfSpeech
            key={o.partOfSpeech + i}
            type={o.partOfSpeech}
            phonetics={phonetics}
          />

          {o.definitions.map((m, i2) => {
            return (
              <Meaning
                key={obj._array[0].word + i + i2}
                number={i2 + 1}
                content={m.definition}
              />
            );
          })}
        </View>
      );
    });
  }

  // Retorna a linha em que o cursor está, pela posição de caractere,
  // usando os limites (offset) de cada linha em vez de acumular
  // caractere a caractere — evita "vazar" pra linha anterior quando
  // o cursor cai bem na quebra de linha.
  function getWordPerLine(content, cursor) {
    const lines = content.split("\n");
    let offset = 0;

    for (let line of lines) {
      const lineStart = offset;
      const lineEnd = offset + line.length;

      if (cursor.end >= lineStart && cursor.end <= lineEnd) {
        return line.trim().toLowerCase().replace("- ", "");
      }

      offset = lineEnd + 1; // +1 pula o caractere "\n"
    }

    return "";
  }

  // Query DB
  async function findWord(word) {
    if (word === lastQuery.current) return null;
    lastQuery.current = word;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (!word) {
      setResult(null);
      setNotFoundWord(null);
      return null;
    }

    const q = word.toLowerCase();

    // Dicionário pessoal tem prioridade sobre a base oficial
    const customEntry = await findCustomWord(q, lang);
    if (customEntry) {
      setNotFoundWord(null);
      setResult(
        JSON.stringify({
          _array: [
            {
              word: customEntry.word,
              meanings: JSON.stringify([
                {
                  partOfSpeech: customEntry.partOfSpeech,
                  definitions: [{ definition: customEntry.definition }],
                },
              ]),
              phonetics: JSON.stringify([]),
            },
          ],
        })
      );
      return null;
    }

    if (!db.current) return null;

    db.current.transaction((tx) => {
      tx.executeSql(
        `select * from words WHERE word='${q}'`,
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            setNotFoundWord(null);
            setResult(JSON.stringify(rows));
          } else {
            setResult(null);
            setNotFoundWord(q);
          }
        }
      );
    });
  }

  // Events
  // --------------------------
  const onChangeNoteText = (value) => {
    setNoteContent(value);

    let query = getWordPerLine(value, cursorPos);
    findWord(query);
    updateNoteContent(noteID.current, value);

    //TODO: Check performance
    updateGlobalState();
  };

  const onNoteSelectionChage = (event) => {
    let sel = event.nativeEvent.selection;

    setCursorPos(sel);
    let query = getWordPerLine(noteContent, sel);
    findWord(query);
  };

  const onTitleChange = (value) => {
    setTitle(value);
  };

  // Method called at input onblur
  const sendTitleUpdate = () => {
    updateGlobalState();
    updateTitle(noteID.current, title, noteContent);

    noteInput.current.focus();
  };

  const onFocusTitle = () => {
    setResult(null);
  };

  const onCopyNote = async () => {
    const fullText = title ? `${title}\n\n${noteContent}` : noteContent;
    await Clipboard.setStringAsync(fullText);
    setToastTrigger(Date.now());
  };

  const onFocusNote = () => {
    let query = getWordPerLine(noteContent, cursorPos);
    findWord(query);
  };

  const updateGlobalState = () => {
    const index = globalData.findIndex((item) => item.id === noteID.current);

    if (index !== -1) {
      let newState = [...globalData];
      newState[index].title = title;
      newState[index].content = noteContent;
      newState[index].lastModified = Date.now();

      if (route.params?.lang) {
        newState[index].lang = route.params.lang;
      }

      setGlobalData(newState);
    }
  };

  if (!noteID) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style={dark ? "light" : "dark"} />

      <ScrollView
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        ref={scrollParentInput}
        style={{
          flex: 1,
        }}
        persistentScrollbar={true}
        removeClippedSubviews={true}
      >
        {/* ####### Title ##### */}
        <TextInput
          selectTextOnFocus={false}
          contextMenuHidden={true}
          autoCorrect={false}
          spellCheck={false}
          selectionColor={colors.primary}
          onChangeText={onTitleChange}
          onBlur={sendTitleUpdate}
          onFocus={onFocusTitle}
          placeholder={`# ${defaultTitle}`}
          placeholderTextColor={dark ? "#ffffff40" : "#00000040"}
          style={[styles.input, styles.title, { color: colors.text }]}
          returnKeyType="default"
        >
          <Text>{title}</Text>
        </TextInput>

        {/* ####### Note ##### */}
        <TextInput
          // onScroll={(event) => console.log(event)}
          ref={noteInput}
          style={[
            styles.input,
            {
              color: colors.text,
              paddingBottom: Platform.OS === "android" ? 200 : 0,
            },
          ]}
          multiline
          scrollEnabled={false}
          //autoFocus={true}
          selectionColor={colors.primary}
          autoCorrect={false}
          autoCapitalize="none"
          selectTextOnFocus={false}
          contextMenuHidden={false}
          spellCheck={false}
          textAlignVertical="top"
          onChangeText={onChangeNoteText}
          onSelectionChange={onNoteSelectionChage}
          onFocus={onFocusNote}
        >
          <Text>{noteContent}</Text>
        </TextInput>
      </ScrollView>

      {/* ####### Result ##### */}
      {result && (
        <ScrollView
          ref={scrollParentResult}
          contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
          persistentScrollbar={true}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
          style={[
            styles.resultContainer,
            {
              backgroundColor: colors.backgroundLevel2,
            },
          ]}
          onContentSizeChange={() => {
            scrollParentResult.current.scrollTo({
              x: 0,
              y: 0,
              animated: false,
            });
          }}
        >
          {parseResult(result)}
        </ScrollView>
      )}

      {!result && notFoundWord && (
        <View
          style={[
            styles.resultContainer,
            styles.notFoundContainer,
            { backgroundColor: colors.backgroundLevel2 },
          ]}
        >
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            "{notFoundWord}" não encontrada
          </Text>
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate("Settings.customDictAdd", {
                initialWord: notFoundWord,
                lang,
              })
            }
          >
            <View
              style={[styles.addWordButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.addWordButtonText}>Adicionar definição</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}

      <Toast message="Caderno copiado para a área de transferência" trigger={toastTrigger} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 18,
    lineHeight: 36,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    height: 42,
    letterSpacing: -0.5,
  },
  resultContainer: {
    fontFamily: "iA Writer Duo",
    width: "100%",
    height: 165,
    backgroundColor: "#E6E6E6",
    padding: 16,
    paddingTop: 12,
  },
  notFoundContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontFamily: "iA Writer Duo",
    fontSize: 14,
    marginBottom: 12,
  },
  addWordButton: {
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  addWordButtonText: {
    color: "#fff",
    fontFamily: "iA Writer Duo",
    fontWeight: "600",
    fontSize: 14,
  },
});
