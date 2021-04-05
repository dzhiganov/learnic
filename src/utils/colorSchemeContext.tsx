import React, { createContext, useEffect, useMemo } from 'react';
import useSelector from '~hooks/useSelector';

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
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

interface ColorSchemeProviderFunc {
  ({ children }: { children: JSX.Element }): JSX.Element;
}

const ColorSchemeProvider: ColorSchemeProviderFunc = ({ children }) => {
  const userColorScheme =
    useSelector<ColorSchemes>('user.colorScheme') || DEFAULT_SCHEME;

  const [state, dispatch] = React.useReducer(colorSchemeReducer, {
    scheme:
      userColorScheme === 'default' || !userColorScheme
        ? DEFAULT_SCHEME
        : userColorScheme,
  });

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

const useColorScheme = (): Context => {
  const context = React.useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }

  return context as Context;
};

export {
  ColorSchemes,
  ColorSchemeContext,
  ColorSchemeProvider,
  useColorScheme,
};
