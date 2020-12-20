import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import CheckAuth from '.';
import { Statuses } from '../../../core/store/models/user';

const mockStore = configureStore();

it('check redirect to home page', async () => {
  const initialState = {
    user: {
      uid: 'userId',
      status: Statuses.Success,
    },
  };
  const store = mockStore(initialState);

  const { container } = render(
    <Provider store={store}>
      <Router>
        <CheckAuth>
          <Switch>
            <Route path="/home">Home page</Route>
            <Route path="/login">Login page</Route>
          </Switch>
        </CheckAuth>
      </Router>
    </Provider>
  );

  expect(container).toHaveTextContent(/Home page/);
});

it('check redirect to login page', async () => {
  const initialState = {
    user: {
      uid: '',
      status: Statuses.Success,
    },
  };
  const store = mockStore(initialState);

  const { container } = render(
    <Provider store={store}>
      <Router>
        <CheckAuth>
          <Switch>
            <Route path="/home">Home page</Route>
            <Route path="/login">Login page</Route>
          </Switch>
        </CheckAuth>
      </Router>
    </Provider>
  );

  expect(container).toHaveTextContent(/Login page/);
});

it('check return loading', async () => {
  const initialState = {
    user: {
      uid: '',
      status: Statuses.Pending,
    },
  };
  const store = mockStore(initialState);

  const { container } = render(
    <Provider store={store}>
      <Router>
        <CheckAuth>
          <Switch>
            <Route path="/home">Home page</Route>
            <Route path="/login">Login page</Route>
          </Switch>
        </CheckAuth>
      </Router>
    </Provider>
  );

  expect(container).toHaveTextContent(/Loading.../);
});
