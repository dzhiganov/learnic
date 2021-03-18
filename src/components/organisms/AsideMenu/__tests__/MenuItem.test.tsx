import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MenuItem from '../MenuItem';

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
    const FAKE_TITLE = 'FAKE_TITLE';
    const FAKE_LINK = 'FAKE_LINK';

    const { getByTestId, queryByTestId } = render(
      <Router history={history}>
        <Provider store={fakeStore}>
          <MenuItem title={FAKE_TITLE} to={FAKE_LINK} onClick={() => {}} />
        </Provider>
      </Router>
    );

    expect(getByTestId('page-link')).toHaveAttribute('href', `/${FAKE_LINK}`);
    expect(queryByTestId('training-count')).toBeNull();
  });
});
