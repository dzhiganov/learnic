import axios from 'axios';

export const translatorURL = 'https://developers.lingvolive.com/api';
export const dictionaryURL = 'https://api.dictionaryapi.dev/api/v2/entries';
export const AUTHORIZATION = 'Authorization';

export const proxy = process.env.REACT_APP_PROXY;

export enum AvailableLanguage {
  Ru = 'ru',
  En = 'en',
}

export const langCodes = {
  [AvailableLanguage.Ru]: '1033',
  [AvailableLanguage.En]: '1049',
};

export const getTranslatorAuthKey = async (apiKey: string): Promise<string> => {
  const url = `${proxy}/${translatorURL}/v1.1/authenticate`;
  const { data } = await axios.post(url, null, {
    headers: {
      [AUTHORIZATION]: `Basic ${apiKey}`,
    },
  });

  return data;
};

type DefinitionResponse = {
  word: string;
  phonetics: { text: string; audio: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example: string; synonyms: string[] }[];
  }[];
}[];

export const getWordDefinition = async (
  word: string,
  lang = AvailableLanguage.En
): Promise<DefinitionResponse> => {
  const url = `${proxy}/${dictionaryURL}/${lang}/${word}`;
  const { data } = await axios.get<DefinitionResponse>(url);

  return data;
};

type TranslateResponse = {
  Heading: string;
  SeeAlso: string[];
  SourceLanguage: number;
  TargetLanguage: number;
  Translation: {
    DictionaryName: string;
    Heading: string;
    OriginalWord: string;
    SoundName: string;
    Translation: string;
  };
};

export const getWordTranslate = async (
  apiKey: string,
  word: string,
  sourceLang: AvailableLanguage,
  destinationLang: AvailableLanguage
): Promise<TranslateResponse> => {
  const url = `${proxy}/${translatorURL}/v1/Minicard/?text=${word}&srcLang=${langCodes[sourceLang]}&dstLang=${langCodes[destinationLang]}`;
  const { data } = await axios.get<TranslateResponse>(url, {
    headers: {
      [AUTHORIZATION]: `Bearer ${apiKey}`,
    },
  });

  return data;
};

export const prepareDefinitionResponse = (
  definitionResponse: DefinitionResponse
): { partOfSpeech: string } => {
  const [definition] = definitionResponse;
  const { meanings } = definition;
  const [meaning] = meanings;
  const { partOfSpeech } = meaning;

  return { partOfSpeech };
};

export const prepareTranslateResponse = (
  translateResponse: TranslateResponse
): { translation: string } => {
  const { Translation } = translateResponse;
  const { Translation: translation } = Translation;

  return { translation };
};

export const getWordData = async (
  apiKey: string,
  word: string,
  sourceLang: AvailableLanguage,
  destinationLang: AvailableLanguage
): Promise<
  ReturnType<typeof prepareDefinitionResponse> &
    ReturnType<typeof prepareTranslateResponse>
> => {
  const translation = await getWordTranslate(
    apiKey,
    word,
    sourceLang,
    destinationLang
  );
  const definition = await getWordDefinition(word, sourceLang);

  return {
    ...prepareTranslateResponse(translation),
    ...prepareDefinitionResponse(definition),
  };
};
