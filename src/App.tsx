import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import CheckAuth from './components/molecules/CheckAuth';
import SwitchRoute from './components/molecules/SwitchRoute';

import store from './core/store';
import { fetchAuth } from './core/store/models/translate';
import { fetchFirebaseUser } from './core/store/models/user';

store.dispatch(fetchAuth());
store.dispatch(fetchFirebaseUser());

// TODO Move loading to single component
const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <Router>
      <Suspense
        fallback={
          <Backdrop open>
            <CircularProgress disableShrink />
          </Backdrop>
        }
      >
        {/* TODO: Should be in special component */}
        <CheckAuth>
          <SwitchRoute />
        </CheckAuth>
      </Suspense>
    </Router>
  </Provider>
);

export default App;
