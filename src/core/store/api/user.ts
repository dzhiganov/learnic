import type { UserOptions } from '~shared/types';
import { server } from '~utils/consts';

const updateUserOptions = (
  uid: string,
  updatedFields: Partial<UserOptions>
): Promise<Response> => {
  return fetch(`${server}/updateUser`, {
    method: 'PATCH',
    body: JSON.stringify({ uid, updatedFields }),
  });
};

export type { UserOptions };
export { updateUserOptions };
