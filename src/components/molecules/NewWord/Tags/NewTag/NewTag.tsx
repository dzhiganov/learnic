import React, { useEffect, useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import CheckIcon from '@material-ui/icons/Check';
import produce from 'immer';
import styles from './NewTag.module.css';
import useSelector from '~hooks/useSelector';
import getUserTags from '~graphql/queries/getUserTags';
import addUserTagMutation from '~graphql/mutations/addUserTag';
import { GetTagQuerySelector } from '~shared/types';

type NewTagProps = {
  onClose: () => void;
};

const NewTag: React.FC<NewTagProps> = ({ onClose }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const userId = useSelector<string>('user.uid');
  const [fetchAddUserTag] = useMutation(addUserTagMutation, {
    update(cache, result) {
      const listWordsQueryResult = cache.readQuery<GetTagQuerySelector>({
        query: getUserTags,
        variables: {
          uid: userId,
        },
      });

      const newListUserTagsQueryResult = produce(
        listWordsQueryResult,
        (draft: typeof listWordsQueryResult) => {
          draft?.user.tags.push(result?.data?.addUserTag?.tag);
        }
      );

      cache.writeQuery({
        query: getUserTags,
        data: {
          user: {
            uid: userId,
            tags: newListUserTagsQueryResult,
            __typename: 'User',
          },
        },
      });
    },
  });

  const handleChange = ({ target: { value: newValue = '' } = {} } = {}) =>
    setValue(newValue);

  const handleClickSave = () => {
    fetchAddUserTag({
      variables: {
        uid: userId,
        name: value,
        color: '#fff',
      },
    }).then(onClose);
  };

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleOnKeyDown: React.KeyboardEventHandler = (e) => {
    e.stopPropagation();

    if (e.key === 'Enter') {
      handleClickSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.tag} ${styles.newTag}`}
      data-testid="newTagContainer"
    >
      <input
        className={styles.newTagInput}
        value={value}
        onChange={handleChange}
        ref={inputRef}
        onKeyDown={handleOnKeyDown}
        data-testid="newTagInput"
      />
      <button
        type="button"
        onClick={handleClickSave}
        className={styles.iconButton}
      >
        <CheckIcon className={styles.saveIcon} />
      </button>
    </div>
  );
};

export default NewTag;
