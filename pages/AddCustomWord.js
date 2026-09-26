import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import { saveCustomWord } from "../lib/customDictDB";
import { getOfflineLangs } from "../lib/appDB";
import { languages } from "../languages";
import SelectField from "../components/SelectField";
import Chip from "../components/Chip";

// Classes gramaticais, localizadas por idioma. Usa "en" como fallback
// pra qualquer idioma que não esteja mapeado aqui.
const PARTS_OF_SPEECH = {
  en: [
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "preposition",
    "conjunction",
    "interjection",
    "article",
    "numeral",
  ],
  pt: [
    "substantivo",
    "verbo",
    "adjetivo",
    "advérbio",
    "pronome",
    "preposição",
    "conjunção",
    "interjeição",
    "artigo",
    "numeral",
  ],
  es: [
    "sustantivo",
    "verbo",
    "adjetivo",
    "adverbio",
    "pronombre",
    "preposición",
    "conjunción",
    "interjección",
    "artículo",
    "numeral",
  ],
  fr: [
    "nom",
    "verbe",
    "adjectif",
    "adverbe",
    "pronom",
    "préposition",
    "conjonction",
    "interjection",
    "article",
    "numéral",
  ],
  it: [
    "sostantivo",
    "verbo",
    "aggettivo",
    "avverbio",
    "pronome",
    "preposizione",
    "congiunzione",
    "interiezione",
    "articolo",
    "numerale",
  ],
  de: [
    "Substantiv",
    "Verb",
    "Adjektiv",
    "Adverb",
    "Pronomen",
    "Präposition",
    "Konjunktion",
    "Interjektion",
    "Artikel",
    "Numerale",
  ],
};

export default function AddCustomWord({ navigation, route }) {
  const { colors } = useTheme();
  const params = route.params || {};

  const [word, setWord] = useState(params.word || params.initialWord || "");
  const [partOfSpeech, setPartOfSpeech] = useState(params.partOfSpeech || "");
  const [definition, setDefinition] = useState(params.definition || "");
  const [lang, setLang] = useState(params.lang || "en");
  const [availableLangs, setAvailableLangs] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: params.id ? "Editar palavra" : "Adicionar palavra",
    });
  }, []);

  useEffect(() => {
    const loadLangs = async () => {
      const offlineCodes = await getOfflineLangs();
      const list = languages.filter((l) => offlineCodes.includes(l.code));
      const finalList = list.length > 0 ? list : languages.slice(0, 1);
      setAvailableLangs(finalList);

      if (!params.lang) {
        setLang(finalList[0].code);
      }
    };
    loadLangs();
  }, []);

  const canSave = word.trim().length > 0 && definition.trim().length > 0;
  const posOptions = PARTS_OF_SPEECH[lang] || PARTS_OF_SPEECH.en;

  const handleSave = async () => {
    if (!canSave) return;
    await saveCustomWord({
      id: params.id,
      word,
      lang,
      partOfSpeech,
      definition,
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: colors.text }]}>Palavra</Text>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          value={word}
          onChangeText={setWord}
          placeholder="ex: serendipity"
          placeholderTextColor={colors.border}
          autoCapitalize="none"
          textAlignVertical="center"
          includeFontPadding={false}
        />

        <Text style={[styles.label, { color: colors.text }]}>Idioma</Text>
        <View style={styles.chipRow}>
          {availableLangs.map((l) => (
            <Chip
              key={l.code}
              label={l.label}
              active={lang === l.code}
              onPress={() => {
                setLang(l.code);
                setPartOfSpeech("");
              }}
            />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>
          Classe gramatical (opcional)
        </Text>
        <SelectField
          label="Classe gramatical"
          value={partOfSpeech}
          placeholder="Selecione uma classe"
          options={posOptions}
          onSelect={setPartOfSpeech}
        />

        <Text style={[styles.label, { color: colors.text }]}>Definição</Text>
        <TextInput
          style={[
            styles.input,
            styles.multiline,
            { color: colors.text, borderColor: colors.border },
          ]}
          value={definition}
          onChangeText={setDefinition}
          placeholder="O que essa palavra significa?"
          placeholderTextColor={colors.border}
          multiline
          textAlignVertical="top"
          includeFontPadding={false}
        />
      </ScrollView>

      <TouchableOpacity
        onPress={handleSave}
        disabled={!canSave}
        style={[
          styles.saveButton,
          { backgroundColor: canSave ? colors.primary : colors.border },
        ]}
      >
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  label: {
    fontFamily: "iA Writer Quattro",
    fontSize: 14,
    lineHeight: 18,
    includeFontPadding: false,
    marginBottom: 8,
    marginTop: 16,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "iA Writer Quattro",
  },
  multiline: {
    minHeight: 120,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  saveButton: {
    margin: 20,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "iA Writer Quattro",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 20,
    includeFontPadding: false,
  },
});
