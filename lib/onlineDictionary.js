// Consulta a freeDictionaryAPI (api.dictionaryapi.dev) como fallback
// online, quando uma palavra não é encontrada nem na base oficial nem
// no dicionário pessoal. Só suporta inglês de forma confiável — o
// próprio mantenedor da API removeu o suporte aos outros idiomas em
// algum momento, então não arriscamos isso aqui.
//
// A API é pública e às vezes fica fora do ar; qualquer falha (rede,
// timeout, resposta inesperada) deve ser silenciosa — o app segue
// mostrando "palavra não encontrada" normalmente nesse caso.

const TIMEOUT_MS = 6000;

export async function fetchOnlineDefinition(word, lang) {
  if (lang !== "en") return null;
  if (!word) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
      )}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];

    const phonetics = (entry.phonetics || [])
      .filter((p) => p.text)
      .map((p) => ({ text: p.text, audio: p.audio || "" }));

    const meanings = (entry.meanings || [])
      .filter((m) => m.definitions && m.definitions.length > 0)
      .map((m) => ({
        partOfSpeech: m.partOfSpeech || "",
        definitions: m.definitions.map((d) => ({
          definition: d.definition,
        })),
      }));

    if (meanings.length === 0) return null;

    return {
      word: entry.word || word,
      phonetics: JSON.stringify(phonetics),
      meanings: JSON.stringify(meanings),
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
