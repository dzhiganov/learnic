import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MenuItem from '../MenuItem';
import { keys } from '../consts';

const mockStore = configureStore([]);
jest.mock('react-i18next');

describe('MenuItem', () => {
  test('shoud render with correct attributes', () => {
    const fakeInitialStore = {
      translate: {
        token: 'FAKE_TOKEN',
      },
      words: {
        all: [],
        training: [],
      },
    };

    const fakeStore = mockStore(fakeInitialStore);
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const FAKE_ID = 'FAKE_ID';
    const FAKE_TITLE = 'FAKE_TITLE';
    const FAKE_PREFIX = 'FAKE_PREFIX';
    const FAKE_LINK = 'FAKE_LINK';

    const { getByTestId, queryByTestId } = render(
      <Router history={history}>
        <Provider store={fakeStore}>
          <MenuItem
            id={FAKE_ID}
            title={FAKE_TITLE}
            prefix={FAKE_PREFIX}
            to={FAKE_LINK}
            onClick={() => {}}
          />
        </Provider>
      </Router>
    );

    expect(getByTestId('page-link')).toHaveAttribute('href', `/${FAKE_LINK}`);
    expect(queryByTestId('training-count')).toBeNull();
  });

  test('shoud render with correct training count', () => {
    const anotherHistory = createMemoryHistory({
      initialEntries: ['/'],
    });
    const TRAINING_WORDS_COUNT = 3;
    const FAKE_WORD = 'FAKE_WORD';
    const FAKE_TITLE = 'FAKE_TITLE';
    const FAKE_LINK = 'FAKE_LINK';
    const FAKE_PREFIX = 'FAKE_PREFIX';

    const anotherFakeInitialStore = {
      translate: {
        token: 'FAKE_TOKEN',
      },
      words: {
        all: [],
        training: Array(TRAINING_WORDS_COUNT).fill(FAKE_WORD),
      },
    };

    const anotherFakeStore = mockStore(anotherFakeInitialStore);

    const { getByTestId, queryByTestId } = render(
      <Router history={anotherHistory}>
        <Provider store={anotherFakeStore}>
          <MenuItem
            id={keys.TRAININGS}
            title={FAKE_TITLE}
            to={FAKE_LINK}
            prefix={FAKE_PREFIX}
            onClick={() => {}}
          />
        </Provider>
      </Router>
    );

    expect(getByTestId('page-link')).toHaveAttribute('href', `/${FAKE_LINK}`);
    expect(queryByTestId('training-count')).toBeTruthy();
    expect(queryByTestId('training-count')).toHaveTextContent(
      TRAINING_WORDS_COUNT.toString()
    );
  });
});
