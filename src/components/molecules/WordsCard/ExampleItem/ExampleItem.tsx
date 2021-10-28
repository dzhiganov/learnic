import React, { FC, useState, useRef } from 'react';
import { DeleteIcon, EditIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons';
import { useMutation } from '@apollo/client';
import styles from './ExampleItem.module.css';
import deleteExampleMutation from '~graphql/mutations/deleteExample';
import updateExampleMutation from '~graphql/mutations/updateExample';
import useSelector from '~hooks/useSelector';

type ExampleItemProps = {
  id: string;
  wordId: string;
  text: string;
};

const ExampleItem: FC<ExampleItemProps> = ({ id, wordId, text }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editable, setEditable] = useState(false);
  const [value, setValue] = useState(text);
  const [hover, setHover] = useState(false);
  const [fetchDelete] = useMutation(deleteExampleMutation, {
    update(cache, result) {
      const deletedId = result?.data?.deleteExample;

      cache.evict({
        id: cache.identify({
          __typename: 'ExampleOutput',
          id: deletedId,
        }),
      });
    },
  });

  const [fetchUpdate] = useMutation(updateExampleMutation);

  const uid = useSelector<string>('user.uid');

  const handleDelete = async () => {
    await fetchDelete({
      variables: { uid, wordId, id },
    });
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const handleSave = () => {
    fetchUpdate({
      variables: {
        uid,
        wordId,
        data: {
          id,
          text: value,
        },
      },
    }).then(() => {
      setEditable(false);
      setHover(false);
    });
  };

  return (
    <li
      className={`${editable ? styles.active : ''} ${styles.examplesItem}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {editable ? (
        <input
          className={styles.exampleInput}
          value={value}
          onChange={handleChange}
          ref={inputRef}
        />
      ) : (
        <span className={styles.example} key={text}>
          {`- ${text}`}
        </span>
      )}
      {editable ? (
        <div className={`${styles.icons} ${styles.visible}`}>
          <CheckIcon className={styles.icon} onClick={handleSave} />
          <CloseIcon
            className={styles.icon}
            onClick={() => {
              setEditable(false);
            }}
          />
        </div>
      ) : (
        <div className={`${styles.icons} ${hover ? styles.visible : ''}`}>
          <EditIcon
            className={styles.icon}
            onClick={() => {
              setEditable(true);
              setTimeout(
                () =>
                  inputRef.current &&
                  typeof inputRef.current.focus === 'function' &&
                  inputRef.current.focus(),
                0
              );
            }}
          />
          <DeleteIcon className={styles.icon} onClick={handleDelete} />
        </div>
      )}
    </li>
  );
};

export default ExampleItem;
