import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';

import store from './core/store';

const Home = lazy(() => import('./components/pages/Home'));
const Login = lazy(() => import('./components/pages/Login'));
const SignUp = lazy(() => import('./components/pages/SignUp'));

const HOME = '/';
const LOGIN = '/login';
const SIGNUP = '/signup';

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <Router>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Switch>
          <Route exact path={HOME} component={Home} />
          <Route path={LOGIN} component={Login} />
          <Route path={SIGNUP} component={SignUp} />
        </Switch>
      </Suspense>
    </Router>
  </Provider>
);

export default App;
