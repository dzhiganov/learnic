import React, { createContext, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import useSelector from '~hooks/useSelector';
import getUserColorSchemeQuery from '~graphql/queries/getUserColorScheme';

enum ColorSchemes {
  LIGHT = 'light',
  DARK = 'dark',
  DEFAULT = 'default',
}

const DEFAULT_SCHEME = ColorSchemes.LIGHT;

type State = {
  scheme: ColorSchemes.LIGHT | ColorSchemes.DARK;
};

type Action = {
  type: ColorSchemes;
};

type Context = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const ColorSchemeContext = createContext<null | Context>(null);

interface ColorSchemeReducerFunc {
  (state: State, action: Action): State;
}

const colorSchemeReducer: ColorSchemeReducerFunc = (_state, action) => {
  switch (action.type) {
    case ColorSchemes.LIGHT: {
      return { scheme: ColorSchemes.LIGHT };
    }
    case ColorSchemes.DARK: {
      return { scheme: ColorSchemes.DARK };
    }
    default: {
      return action as never;
    }
  }
};

interface ColorSchemeProviderFunc {
  ({ children }: { children: JSX.Element }): JSX.Element;
}

const ColorSchemeProvider: ColorSchemeProviderFunc = ({ children }) => {
  const uid = useSelector<string>('user.uid');
  const { loading, data } = useQuery(getUserColorSchemeQuery, {
    variables: { uid },
  });

  let userColorScheme: ColorSchemes;
  if (loading) {
    userColorScheme = DEFAULT_SCHEME;
  } else {
    userColorScheme = data?.user?.userOptions?.colorScheme;
  }

  const [state, dispatch] = React.useReducer(colorSchemeReducer, {
    scheme:
      userColorScheme === 'default' || !userColorScheme
        ? DEFAULT_SCHEME
        : userColorScheme,
  });

  useEffect(() => {
    if (!loading) {
      dispatch({
        type: userColorScheme,
      });
    }
  }, [loading, userColorScheme]);

  useEffect(() => {
    document.documentElement.dataset.scheme = state.scheme;
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

class ContextError extends Error {}

const useColorScheme = (): Context | ContextError => {
  const context = React.useContext(ColorSchemeContext);
  if (!context) {
    throw new ContextError(
      'useCount must be used within a ColorSchemeProvider'
    );
  }

  return context;
};

export {
  ColorSchemes,
  ColorSchemeContext,
  ColorSchemeProvider,
  useColorScheme,
};
