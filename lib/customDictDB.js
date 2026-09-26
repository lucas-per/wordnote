import AsyncStorage from "@react-native-async-storage/async-storage";

const CUSTOM_DICT_KEY = "@customDict";

// ------------------
// Dicionário pessoal
// ------------------
// Cada entrada: { id, word, lang, partOfSpeech, definition, updatedAt }

export const getCustomWords = async () => {
  try {
    const value = await AsyncStorage.getItem(CUSTOM_DICT_KEY);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

// Busca uma entrada pessoal por palavra + idioma (case-insensitive).
// Usada pelo Editor antes de consultar a base oficial.
export const findCustomWord = async (word, lang) => {
  try {
    const list = await getCustomWords();
    const q = word.trim().toLowerCase();
    return (
      list.find(
        (item) =>
          item.word.trim().toLowerCase() === q && item.lang === lang
      ) || null
    );
  } catch (e) {
    console.log(e);
    return null;
  }
};

// Cria ou atualiza (se `entry.id` já existir na lista) uma entrada.
export const saveCustomWord = async (entry) => {
  try {
    const list = await getCustomWords();
    const index = entry.id
      ? list.findIndex((item) => item.id === entry.id)
      : -1;

    const record = {
      id: entry.id || makeId(),
      word: entry.word.trim(),
      lang: entry.lang,
      partOfSpeech: (entry.partOfSpeech || "").trim(),
      definition: entry.definition.trim(),
      updatedAt: Date.now(),
    };

    if (index !== -1) {
      list[index] = record;
    } else {
      list.push(record);
    }

    await AsyncStorage.setItem(CUSTOM_DICT_KEY, JSON.stringify(list));
    return record;
  } catch (e) {
    console.log(e);
  }
};

export const deleteCustomWord = async (id) => {
  try {
    const list = await getCustomWords();
    const newList = list.filter((item) => item.id !== id);
    await AsyncStorage.setItem(CUSTOM_DICT_KEY, JSON.stringify(newList));
    return newList;
  } catch (e) {
    console.log(e);
  }
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
