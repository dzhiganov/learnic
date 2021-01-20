import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import * as translateApi from '../../../../core/store/api/translate';
import NewWord from '.';
import 'whatwg-fetch';

jest.spyOn(translateApi, 'getTranslate');
jest.useFakeTimers();
translateApi.getTranslate.mockImplementation(() => {});

const mockStore = configureStore([]);

describe('NewWord', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should set focus on the Word input', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();
    const initialState = {
      word: 'test1',
      translate: 'test2',
    };
    const store = mockStore({});
    const { queryByTestId } = render(
      <Provider store={store}>
        <NewWord
          onSave={onSave}
          onCancel={onCancel}
          initialState={initialState}
          autoFetch={false}
        />
      </Provider>
    );

    act(() => {
      expect(queryByTestId('word') === document.activeElement).toBeTruthy();
    });
  });

  test('should render with correct initial state', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();
    const initialState = {
      word: 'test1',
      translate: 'test2',
    };
    const store = mockStore({});
    const { container, queryByTestId } = render(
      <Provider store={store}>
        <NewWord
          onSave={onSave}
          onCancel={onCancel}
          initialState={initialState}
          autoFetch={false}
        />
      </Provider>
    );

    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    expect(wordInput.value).toBe('test1');
    expect(translateInput.value).toBe('test2');
    act(() => {
      expect(queryByTestId('word') === document.activeElement).toBeTruthy();
    });
  });

  test('user change input value', () => {
    translateApi.getTranslate.mockImplementation(() => {});
    const onSave = jest.fn();
    const onCancel = jest.fn();
    const initialStore = {
      translate: {
        token: 'FAKE_TOKEN',
      },
    };
    const store = mockStore(initialStore);
    const { container } = render(
      <Provider store={store}>
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
    translateApi.getTranslate.mockImplementation(() => {});
    const onSave = jest.fn();
    const onCancel = jest.fn();
    const initialState = {
      word: 'initialWord',
      translate: 'initialTranslate',
    };
    const initialStore = {
      translate: {
        token: 'FAKE_TOKEN',
      },
    };
    const store = mockStore(initialStore);
    const { container } = render(
      <Provider store={store}>
        <NewWord
          onSave={onSave}
          onCancel={onCancel}
          initialState={initialState}
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
    const onSave = jest.fn();
    const onCancel = jest.fn();
    const initialStore = {
      translate: {
        token: 'FAKE_TOKEN',
      },
    };
    const initialState = {
      word: 'initialWord',
      translate: 'initialTranslate',
    };
    const store = mockStore(initialStore);
    const { container } = render(
      <Provider store={store}>
        <NewWord
          onSave={onSave}
          onCancel={onCancel}
          initialState={initialState}
          autoFetch
        />
      </Provider>
    );

    const wordInput = container.querySelector('[name="word"]');
    const translateInput = container.querySelector('[name="translate"]');

    userEvent.type(wordInput, '{selectall}{backspace}w');

    expect(translateApi.getTranslate).not.toHaveBeenCalled();

    expect(wordInput).toHaveValue('w');
    expect(translateInput).toHaveValue('initialTranslate');
  });
});
