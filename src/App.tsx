import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import { HOME, LOGIN, SIGNUP, PROMO } from './core/router/paths';
import CheckAuth from './components/molecules/CheckAuth';

import store from './core/store';
import { fetchAuth } from './core/store/models/translate';
import { fetchFirebaseUser } from './core/store/models/user';

const Home = lazy(() => import('./components/pages/Home'));
const Login = lazy(() => import('./components/pages/Login'));
const SignUp = lazy(() => import('./components/pages/SignUp'));
const Promo = lazy(() => import('./components/pages/Promo'));

store.dispatch(fetchAuth());
store.dispatch(fetchFirebaseUser());

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <Router>
      <Suspense fallback={<div>Загрузка...</div>}>
        <CheckAuth>
          <Switch>
            <Route path={HOME} component={Home} />
            <Route path={LOGIN} component={Login} />
            <Route path={SIGNUP} component={SignUp} />
            <Route path={PROMO} component={Promo} />
          </Switch>
        </CheckAuth>
      </Suspense>
    </Router>
  </Provider>
);

export default App;
