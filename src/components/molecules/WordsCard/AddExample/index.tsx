import React, { memo, useState, useRef } from 'react';
import { Tooltip } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import produce from 'immer';
import styles from './styles.module.css';
import SaveButton from '~c/molecules/NewWord/SaveButton';
import addExampleMutation from '~graphql/mutations/addExample';
import useSelector from '~hooks/useSelector';
import getWordsQuery from '~graphql/queries/getWords';
import { User } from '~shared/types';

type Props = {
  wordId: string;
};

// const timer: ReturnType<typeof setTimeout> | null = null;
// const tooltipShowTime = 4000;

const AddExample: React.FunctionComponent<Props> = ({ wordId }: Props) => {
  const uid = useSelector<string>('user.uid');
  const [example, setExample] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [fetchAdd] = useMutation(addExampleMutation, {
    update(cache, result) {
      const listWordsQueryResult = cache.readQuery<{
        user: User;
      }>({
        query: getWordsQuery,
        variables: {
          uid,
        },
      });

      const newListUserTagsQueryResult = produce(
        listWordsQueryResult,
        (draft: typeof listWordsQueryResult) => {
          const wordIndex = draft?.user.words.findIndex(
            (it) => it.id === wordId
          ) as number;
          draft?.user.words[wordIndex].examples?.push(
            result?.data?.addExample?.example
          );
        }
      );

      cache.writeQuery({
        query: getWordsQuery,
        data: {
          user: {
            uid,
            words: newListUserTagsQueryResult,
            __typename: 'User',
          },
        },
      });
    },
  });

  const handleAddNewExample = async () => {
    await fetchAdd({
      variables: { uid, wordId, data: { text: example } },
    });
  };

  // const handleOnSave = () => {
  //   if (!example) {
  //     if (!showTooltip) {
  //       setShowTooltip(true);
  //     }
  //     if (timer) clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       setShowTooltip(false);
  //       timer = null;
  //     }, tooltipShowTime);
  //     return;
  //   }
  //   onSave(example).then(() => setExample(''));
  // };

  const handleChangeInput: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    const { value } = e.target;
    setExample(value);
  };

  const handleFocus = () => setShowTooltip(false);

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <textarea
          ref={textAreaRef}
          className={styles.input}
          value={example}
          onChange={handleChangeInput}
          onFocus={handleFocus}
          rows={4}
          placeholder="Add another one..."
        />
      </div>
      <div className={styles.buttonsContainer}>
        <Tooltip
          label="The example text must contain at least one letter"
          aria-label="Empty example field"
          isOpen={showTooltip}
          color="white"
          background="black"
          placement="top"
          hasArrow
        >
          <span>
            <SaveButton onSave={handleAddNewExample} />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default memo(AddExample);
