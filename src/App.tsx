import React, { Suspense, memo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import {
  createMuiTheme,
  ThemeProvider as MaterialThemeProvider,
} from '@material-ui/core/styles';
import CheckAuth from './components/molecules/CheckAuth';
import SwitchRoute from './components/molecules/SwitchRoute';
import {
  ColorSchemeProvider,
  useColorScheme,
} from './utils/colorSchemeContext';

import store from './core/store';
import { fetchAuth } from './core/store/models/translate';
import { fetchFirebaseUser } from './core/store/models/user';

store.dispatch(fetchAuth());
store.dispatch(fetchFirebaseUser());

const ThemeProvider: React.FC = ({ children }) => {
  const { state } = useColorScheme();

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: state.scheme,
        },
      }),
    [state]
  );

  return (
    <MaterialThemeProvider theme={theme}>{children}</MaterialThemeProvider>
  );
};

const App: React.FunctionComponent = () => {
  return (
    <ColorSchemeProvider>
      <ThemeProvider>
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
      </ThemeProvider>
    </ColorSchemeProvider>
  );
};

export default memo(App);
