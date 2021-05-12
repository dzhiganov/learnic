import User from '../../models/User';

jest.mock('../../database');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testing User methods', () => {
  test('User.getUser should return user definition', async () => {
    const result = await User.getUser('1');

    expect(result).toMatchObject({
      uid: '1',
      userOptions: {
        language: 'en',
        colorScheme: 'light',
      },
    });
  }, 5000);
});
