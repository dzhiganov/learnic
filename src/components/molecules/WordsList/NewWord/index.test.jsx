import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import * as translateApi from '../../../../core/store/api/translate';
import NewWord from '.';

let mockedTranslateApi;
let mockedConsoleError;
let onSave;
let onCancel;

const fakeInitialState = {
  word: 'test1',
  translate: 'test2',
};

const mockStore = configureStore([]);

const fakeInitialStore = {
  translate: {
    token: 'FAKE_TOKEN',
  },
};

const fakeStore = mockStore(fakeInitialStore);

describe('NewWord', () => {
  beforeAll(() => {
    mockedTranslateApi = jest
      .spyOn(translateApi, 'getTranslate')
      .mockImplementation(() => {});
    mockedConsoleError = jest
      .spyOn(global.console, 'error')
      .mockImplementationOnce(() => {});

    onSave = jest.fn();
    onCancel = jest.fn();
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
    const { queryByTestId } = render(
      <Provider store={fakeStore}>
        <NewWord
          onSave={onSave}
          onCancel={onCancel}
          initialState={fakeInitialState}
          autoFetch={false}
        />
      </Provider>
    );

    expect(queryByTestId('word') === document.activeElement).toBeTruthy();
  });

  test('should render with correct initial state', () => {
    const { container, queryByTestId } = render(
      <Provider store={fakeStore}>
        <NewWord
          onSave={onSave}
          onCancel={onCancel}
          initialState={fakeInitialState}
          autoFetch={false}
        />
      </Provider>
    );

    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    expect(wordInput.value).toBe(fakeInitialState.word);
    expect(translateInput.value).toBe(fakeInitialState.translate);
    expect(queryByTestId('word') === document.activeElement).toBeTruthy();
  });

  test('user change input value', () => {
    const { container } = render(
      <Provider store={fakeStore}>
        <NewWord onSave={onSave} onCancel={onCancel} autoFetch />
      </Provider>
    );

    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    userEvent.type(wordInput, 'hello world');
    userEvent.type(translateInput, 'hello world');

    expect(wordInput).toHaveValue('hello world');
    expect(translateInput).toHaveValue('hello world');
  });

  test('user change type text after delete initial values', () => {
    const { container } = render(
      <Provider store={fakeStore}>
        <NewWord
          onSave={onSave}
          onCancel={onCancel}
          initialState={fakeInitialState}
          autoFetch={false}
        />
      </Provider>
    );

    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    userEvent.type(wordInput, '{selectall}{backspace}New word');
    userEvent.type(translateInput, '{selectall}{backspace}New translate');

    expect(wordInput).toHaveValue('New word');
    expect(translateInput).toHaveValue('New translate');
  });

  test('should not fetch translate if autoFetch is false', async () => {
    const { container } = render(
      <Provider store={fakeStore}>
        <NewWord
          onSave={onSave}
          onCancel={onCancel}
          initialState={fakeInitialState}
          autoFetch={false}
        />
      </Provider>
    );

    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    userEvent.type(wordInput, '{selectall}{backspace}w');

    expect(translateApi.getTranslate).not.toHaveBeenCalled();

    expect(wordInput).toHaveValue('w');
    expect(translateInput).toHaveValue(fakeInitialState.translate);
  });

  test('should fetch have been called n times', async () => {
    let container;
    const DELAY = 500;

    act(() => {
      const rendered = render(
        <Provider store={fakeStore}>
          <NewWord onSave={onSave} onCancel={onCancel} autoFetch />
        </Provider>
      );
      container = rendered.container;
    });

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
