import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import './i18n';
import {
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  FieldMergeFunction,
} from '@apollo/client';
import reportWebVitals from './reportWebVitals';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;

const merge: FieldMergeFunction<unknown, unknown> = (_, incoming) => incoming;

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['uid'],
      fields: {
        words: {
          merge,
        },
        userOptions: {
          merge: (existing = {}, incoming: Record<string, unknown>) => {
            return { ...existing, ...incoming };
          },
        },
      },
    },
  },
});
const uri = '/.netlify/functions/graphql';
const connectToDevTools = true;

const client = new ApolloClient({ cache, uri, connectToDevTools });

if (rootElement.hasChildNodes()) {
  hydrate(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>,
    rootElement
  );
} else {
  render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>,
    rootElement
  );
}

reportWebVitals();
