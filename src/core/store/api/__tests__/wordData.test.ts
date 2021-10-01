import mockAxios from 'axios';
import {
  proxy,
  getTranslatorAuthKey,
  translatorURL,
  dictionaryURL,
  getWordTranslate,
  getWordDefinition,
  AvailableLanguage,
  langCodes,
  prepareDefinitionResponse,
  prepareTranslateResponse,
} from '../wordData';

const apiKey = 'secret';

it('get token', async () => {
  (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: 'token',
    })
  );

  const response = await getTranslatorAuthKey(apiKey);

  expect(response).toEqual('token');
  expect(mockAxios.post).toHaveBeenCalledTimes(1);
  expect(mockAxios.post).toHaveBeenCalledWith(
    `${proxy}/${translatorURL}/v1.1/authenticate`,
    null,
    {
      headers: { Authorization: 'Basic secret' },
    }
  );
});

it('get translate', async () => {
  const mockResult = {
    translation: 'test1',
  };

  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: mockResult,
    })
  );

  const response = await getWordTranslate(
    'token',
    'test',
    AvailableLanguage.Ru,
    AvailableLanguage.En
  );

  expect(response).toEqual(mockResult);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(
    `${proxy}/${translatorURL}/v1/Minicard/?text=test&srcLang=${
      langCodes[AvailableLanguage.Ru]
    }&dstLang=${langCodes[AvailableLanguage.En]}`,
    {
      headers: { Authorization: 'Bearer token' },
    }
  );
});

it('get definition', async () => {
  const mockResult = {
    partOfSpeech: 'test part of speech',
  };
  const mockWord = 'test';
  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: mockResult,
    })
  );

  const response = await getWordDefinition(mockWord, AvailableLanguage.En);

  expect(response).toEqual(mockResult);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(
    `${proxy}/${dictionaryURL}/${AvailableLanguage.En}/${mockWord}`
  );
});

it('prepare translate response', async () => {
  const mockResponse = {
    Heading: 'test',
    SeeAlso: [],
    SourceLanguage: 0,
    TargetLanguage: 1,
    Translation: {
      DictionaryName: 'test',
      Heading: 'test',
      OriginalWord: 'test',
      SoundName: 'test',
      Translation: 'fake translation',
    },
  };

  const result = prepareTranslateResponse(mockResponse);

  expect(result).toEqual({ translation: 'fake translation' });
});

it('prepare definition response', async () => {
  const mockResponse = [
    {
      word: 'test',
      phonetics: [{ text: 'test', audio: 'test' }],
      meanings: [
        {
          partOfSpeech: 'fake part of speech',
          definitions: [
            { definition: 'test', example: 'test', synonyms: ['test'] },
          ],
        },
      ],
    },
  ];

  const result = prepareDefinitionResponse(mockResponse);

  expect(result).toEqual({ partOfSpeech: 'fake part of speech' });
});
