/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import * as translateApi from '~store/api/wordData';
import NewWord from '.';
import getUseSuggestedTranslate from '~graphql/queries/getUseSuggestedTranslate';

const mocks = [
  {
    request: {
      query: getUseSuggestedTranslate,
      variables: {
        uid: 'FAKE_USER_ID',
      },
      fetchPolicy: 'no-cache',
    },
    result: {
      data: {
        user: {
          uid: 'FAKE_USER_ID',
          userOptions: {
            useSuggestedTranslate: true,
            __typename: 'UserOptions',
          },
          __typename: 'User',
        },
      },
    },
  },
];

let mockedTranslateApi;
let mockedConsoleError;
const mockedOnSave = jest.fn();
const mockedOnCancel = jest.fn();

const fakeInitialState = {
  word: 'test1',
  translate: 'test2',
  tags: ['FAKE_TAG_ID'],
};

const mockStore = configureStore([]);

const fakeInitialStore = {
  user: {
    uid: 'FAKE_USER_ID',
  },
  translate: {
    token: 'FAKE_TOKEN',
  },
};

const fakeStore = mockStore(fakeInitialStore);

const renderNewWord = (
  { autoFetch, initialState } = {
    autoFetch: false,
    initialState: fakeInitialState,
  }
) => {
  const Wrapper = ({ children }) => (
    <Provider store={fakeStore}>{children}</Provider>
  );

  const utils = render(
    <MockedProvider
      mocks={mocks}
      addTypename={false}
      defaultOptions={{ watchQuery: { fetchPolicy: 'no-cache' } }}
    >
      <NewWord
        onSave={mockedOnSave}
        onCancel={mockedOnCancel}
        initialState={initialState}
        autoFetch={autoFetch}
      />
    </MockedProvider>,
    { wrapper: Wrapper }
  );

  return {
    ...utils,
  };
};

describe('NewWord', () => {
  beforeAll(() => {
    mockedTranslateApi = jest
      .spyOn(translateApi, 'getWordData')
      .mockImplementation(() => {});
    mockedConsoleError = jest
      .spyOn(global.console, 'error')
      .mockImplementationOnce(() => {});
  });
  afterAll(() => {
    jest.useRealTimers();
    mockedTranslateApi.mockRestore();
    mockedConsoleError.mockRestore();
  });

  beforeEach(() => {
    jest.useFakeTimers('legacy');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should set focus on the Word input', () => {
    const { queryByTestId } = renderNewWord();

    expect(queryByTestId('word') === document.activeElement).toBeTruthy();
  });

  test('should fetch have been called n times', async () => {
    const DELAY = 2000;

    const { container } = renderNewWord({ autoFetch: true });

    expect(translateApi.getWordData).toHaveBeenCalledTimes(0);

    const wordInput = container.querySelector('[name="word"]');

    act(() => {
      userEvent.type(wordInput, 'w');
      jest.advanceTimersByTime(DELAY);
    });

    expect(translateApi.getWordData).toHaveBeenCalledTimes(1);
    expect(wordInput).toHaveValue('w');

    act(() => {
      userEvent.type(wordInput, 'o');
      jest.advanceTimersByTime(DELAY);
    });

    expect(translateApi.getWordData).toHaveBeenCalledTimes(2);

    expect(wordInput).toHaveValue('wo');
  });
});
