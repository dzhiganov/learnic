import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import useSelector from '~hooks/useSelector';
import getUserTags from '~graphql/queries/getUserTags';
import getDefaultTags from '~graphql/queries/getDefaultTags';
import { Tags as TagsList } from '~shared/types';

const useTags = () => {
  const uid = useSelector<string>('user.uid');

  const [visibleUserTags, setVisibleUserTags] = useState<TagsList>([]);
  const [visibleDefaultTags, setVisibleDefaultTags] = useState<TagsList>([]);

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

  useEffect(() => {
    if (!userTags.length && !defaultTags.length) return;

    if (userTags.length) {
      setVisibleUserTags(userTags);
    }

    if (defaultTags.length) {
      setVisibleDefaultTags(defaultTags);
    }
  }, [userTags, defaultTags]);

  return [defaultTags, userTags];
};

export default useTags;
