/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import * as translateApi from '~store/api/translate';
import NewWord from '.';
// import getUserTags from '~graphql/queries/getUserTags';
// import getDefaultTags from '~graphql/queries/getDefaultTags';

const mocks = [];

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
    <MockedProvider mocks={mocks}>
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
      .spyOn(translateApi, 'getTranslate')
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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should set focus on the Word input', () => {
    const { queryByTestId } = renderNewWord();

    expect(queryByTestId('word') === document.activeElement).toBeTruthy();
  });

  test('should render with correct initial state', () => {
    const { container, queryByTestId } = renderNewWord();

    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    expect(wordInput.value).toBe(fakeInitialState.word);
    expect(translateInput.value).toBe(fakeInitialState.translate);
    expect(queryByTestId('word') === document.activeElement).toBeTruthy();
  });

  test('user change input value', () => {
    const { container } = renderNewWord({ autoFetch: true });
    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    userEvent.type(wordInput, 'hello world');
    userEvent.type(translateInput, 'hello world');

    expect(wordInput).toHaveValue('hello world');
    expect(translateInput).toHaveValue('hello world');
  });

  test('user change type text after delete initial values', () => {
    const { container } = renderNewWord();

    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    userEvent.type(wordInput, '{selectall}{backspace}New word');
    userEvent.type(translateInput, '{selectall}{backspace}New translate');

    expect(wordInput).toHaveValue('New word');
    expect(translateInput).toHaveValue('New translate');
  });

  test('should not fetch translate if autoFetch is false', async () => {
    const { container } = renderNewWord();

    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    userEvent.type(wordInput, '{selectall}{backspace}w');

    expect(translateApi.getTranslate).not.toHaveBeenCalled();

    expect(wordInput).toHaveValue('w');
    expect(translateInput).toHaveValue(fakeInitialState.translate);
  });

  test('should fetch have been called n times', async () => {
    const DELAY = 500;

    const { container } = renderNewWord({ autoFetch: true });

    expect(translateApi.getTranslate).toHaveBeenCalledTimes(0);

    const wordInput = container.querySelector('[name="word"]');

    act(() => {
      userEvent.type(wordInput, 'w');
      jest.advanceTimersByTime(DELAY);
    });

    expect(translateApi.getTranslate).toHaveBeenCalledTimes(1);
    expect(wordInput).toHaveValue('w');

    act(() => {
      userEvent.type(wordInput, 'o');
      jest.advanceTimersByTime(DELAY);
    });

    expect(translateApi.getTranslate).toHaveBeenCalledTimes(2);

    expect(wordInput).toHaveValue('wo');
  });
});
