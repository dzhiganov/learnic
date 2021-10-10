import { useQuery } from '@apollo/client';
import useSelector from '~hooks/useSelector';
import getUserTags from '~graphql/queries/getUserTags';
import getDefaultTags from '~graphql/queries/getDefaultTags';
import { Tags as TagsList } from '~shared/types';

const useTags = (): TagsList[] => {
  const uid = useSelector<string>('user.uid');

  const { data: { user: { tags: userTags = [] } = {} } = {} } = useQuery<{
    user: {
      tags: TagsList;
    };
  }>(getUserTags, {
    variables: {
      uid,
    },
  });

  const { data: { defaultTags = [] } = {} } = useQuery<{
    defaultTags: TagsList;
  }>(getDefaultTags);

  return [defaultTags, userTags];
};

export default useTags;
