import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import NewTag from './NewTag';
import addUserTag from '~graphql/mutations/addUserTag';

const mocks = [
  {
    request: {
      query: addUserTag,
      variables: {
        uid: 'FAKE_USER_ID',
        name: 'FAKE_TAG_NAME',
        color: 'FAKE_TAG_COLOR',
      },
      fetchPolicy: 'no-cache',
    },
    result: {
      data: {
        user: {
          uid: 'FAKE_USER_ID',
          tag: {
            id: 'FAKE_USER_TAG_ID',
            name: 'FAKE_TAG_NAME',
            color: 'FAKE_TAG_COLOR',
            __typename: 'Tag',
          },
          __typename: 'User',
        },
      },
    },
  },
];

const mockStore = configureStore([]);

const fakeInitialStore = {
  user: {
    uid: 'FAKE_USER_ID',
  },
  translate: {
    token: 'FAKE_TOKEN',
  },
};

const fakeStore = mockStore(fakeInitialStore);
const mockedOnClose = jest.fn();

const renderNewTag = () => {
  const Wrapper = ({ children }) => (
    <Provider store={fakeStore}>{children}</Provider>
  );

  const utils = render(
    <MockedProvider
      mocks={mocks}
      addTypename={false}
      defaultOptions={{ watchQuery: { fetchPolicy: 'no-cache' } }}
    >
      <NewTag onClose={mockedOnClose} />
    </MockedProvider>,
    { wrapper: Wrapper }
  );

  return {
    ...utils,
  };
};

describe('test NewTag', () => {
  afterEach(() => {
    mockedOnClose.mockClear();
  });
  test('input should be focused after mount', () => {
    const { queryByTestId } = renderNewTag();

    expect(
      queryByTestId('newTagInput') === document.activeElement
    ).toBeTruthy();
  });

  test('should call onClose after press Escape', () => {
    const { queryByTestId } = renderNewTag();

    userEvent.type(queryByTestId('newTagInput'), '{esc}');
    expect(mockedOnClose).toHaveBeenCalledTimes(1);
  });

  test('should call onClose after press Enter', () => {
    const { queryByTestId } = renderNewTag();

    userEvent.type(queryByTestId('newTagInput'), '{enter}');
    setTimeout(() => expect(mockedOnClose).toHaveBeenCalledTimes(1), 0);
  });
});
