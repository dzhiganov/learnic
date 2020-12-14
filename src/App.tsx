import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import { HOME, LOGIN, SIGNUP } from './core/router/paths';

import store from './core/store';
import { fetchAuth } from './core/store/models/translate';

const Home = lazy(() => import('./components/pages/Home'));
const Login = lazy(() => import('./components/pages/Login'));
const SignUp = lazy(() => import('./components/pages/SignUp'));

store.dispatch(fetchAuth());

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <Router>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Switch>
          <Route path={HOME} component={Home} />
          <Route path={LOGIN} component={Login} />
          <Route path={SIGNUP} component={SignUp} />
        </Switch>
      </Suspense>
    </Router>
  </Provider>
);

export default App;
