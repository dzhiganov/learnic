import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import { INDEX, HOME } from './core/router/paths';
import CheckAuth from './components/molecules/CheckAuth';

import store from './core/store';
import { fetchAuth } from './core/store/models/translate';
import { fetchFirebaseUser } from './core/store/models/user';

const Home = lazy(() => import('./components/pages/Home'));
const Landing = lazy(() => import('./components/pages/Landing'));

store.dispatch(fetchAuth());
store.dispatch(fetchFirebaseUser());

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <Router>
      <Suspense fallback={<div>Загрузка...</div>}>
        {/* TODO: Should be in special component */}
        <CheckAuth>
          <Switch>
            <Route exact path={INDEX} component={Landing} />
            <Route path={HOME} component={Home} />
          </Switch>
        </CheckAuth>
      </Suspense>
    </Router>
  </Provider>
);

export default App;
