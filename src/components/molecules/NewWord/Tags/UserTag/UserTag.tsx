import React from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import { useMutation } from '@apollo/client';
import styles from './UserTag.module.css';
import useSelector from '~hooks/useSelector';
import deleteUserTagMutation from '~graphql/mutations/deleteUserTag';
import Tag, { Status } from '../Tag/Tag';

type UserTagProps = {
  tagId: string;
  name: string;
  onClick: () => void;
  status?: Status;
};

const UserTag: React.FC<UserTagProps> = ({ tagId, name, onClick, status }) => {
  const userId = useSelector<string>('user.uid');
  const [fetchDelete] = useMutation(deleteUserTagMutation, {
    update(cache, result) {
      const id = result?.data?.deleteUserTag;

      cache.evict({
        id: cache.identify({
          __typename: 'Tag',
          id,
        }),
      });
    },
  });

  const handleDelete: React.MouseEventHandler = (e) => {
    e.stopPropagation();

    fetchDelete({
      variables: {
        uid: userId,
        tagId,
      },
    });
  };

  return (
    <Tag name={name} onClick={onClick} status={status}>
      <ClearIcon className={styles.iconButton} onClick={handleDelete} />
    </Tag>
  );
};

export default UserTag;
