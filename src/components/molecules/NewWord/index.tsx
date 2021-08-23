/* eslint-disable css-modules/no-unused-class */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { getTranslate } from 'core/store/api/translate';
import useDebounce from 'react-use/lib/useDebounce';
import { useTranslation } from 'react-i18next';
import Checkbox from '@material-ui/core/Checkbox';
import { useMutation, useQuery } from '@apollo/client';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import CircularProgress from '@material-ui/core/CircularProgress';
import useSelector from '~hooks/useSelector';
import styles from './styles.module.css';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';
import Tags from './Tags';
import { Tags as TagsList } from '~shared/types';
import updateUserOptions from '~graphql/mutations/updateUserOptions';
import getUseSuggestedTranslate from '~graphql/queries/getUseSuggestedTranslate';

type Props = {
  initial: string;
  id: string;
  initialState?: null | {
    word: string;
    translate: string;
    tags: TagsList;
  };
  onSave: ({
    id,
    word,
    translate,
    tags,
  }: {
    id?: string;
    word: string;
    translate: string;
    tags: string[][];
  }) => void;
  onCancel: () => void;
  autoFetch?: boolean;
};

const NewWord: React.FunctionComponent<Props> = ({
  initial,
  id,
  initialState = null,
  onSave,
  onCancel,
  autoFetch = true,
}: Props) => {
  const { t } = useTranslation();
  const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
  const [word, setWord] = useState(initial);
  const [translate, setTranslate] = useState('');
  const [suggestedTranslate, setSuggestedTranslate] = useState('');
  const [tagsIds, setTagsIds] = useState<string[]>([]);
  const token = useSelector<string>('translate.token');
  const [fetchUpdateUserOptions] = useMutation(updateUserOptions);
  const uid = useSelector<string>('user.uid');
  const queryResult = useQuery(getUseSuggestedTranslate, {
    variables: {
      uid,
    },
  });

  const {
    data: {
      user: { userOptions: { useSuggestedTranslate = true } = {} } = {},
    } = {},
  } = queryResult;

  const [{ loading }, fetchTranslate] = useAsyncFn(async (req) => {
    if (!useSuggestedTranslate) return;
    if (!autoFetch || !req) {
      return;
    }
    const res = (await getTranslate(token, req, 'ru', 'en')) as {
      Translation: {
        Translation: string;
      };
    };
    const { Translation: { Translation: dictionaryTranslate = '' } = {} } =
      res || {};
    const [value = ''] = dictionaryTranslate.split(',');

    setSuggestedTranslate(value);
  }, []);

  const [, cancel] = useDebounce(
    async () => {
      if (useSuggestedTranslate) {
        fetchTranslate(word);
      }
    },
    500,
    [word]
  );

  useEffect(() => {
    if (inputRef.current && typeof inputRef.current.focus === 'function') {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (initialState) {
      setWord(initialState?.word);
      setTranslate(initialState?.translate);
      setTagsIds(initialState?.tags.map(({ id: tagId }) => tagId));
    }
  }, [initialState]);

  useEffect(() => {
    if (!word && translate) {
      setTranslate('');
      setSuggestedTranslate('');
    }
  }, [word, translate]);

  const handleOnChangeWord = useCallback(({ target: { value = '' } = {} }) => {
    setWord(value);
  }, []);

  const handleOnChangeTranslate = useCallback(
    async ({ target: { value = '' } = {} }) => {
      cancel();
      setTranslate(value);
    },
    [cancel]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        if (word && translate) {
          onSave({ id, word, translate, tags: [tagsIds, []] });

          setWord('');
          setTranslate('');
        }
      }
    },
    [id, onSave, translate, word, tagsIds]
  );

  const handleOnClickSave = useCallback(() => {
    const result: string[][] = [[], []];
    const [addedTags, removedTags] = result;
    const initialTagsIds = initialState?.tags.map(({ id: tagId }) => tagId);

    // TODO Optimize it!
    initialTagsIds?.forEach((tagId) => {
      if (tagsIds.includes(tagId)) return;
      removedTags.push(tagId);
    });

    tagsIds.forEach((tagId) => {
      if (initialTagsIds?.includes(tagId)) return;
      addedTags.push(tagId);
    });

    if (word && translate) {
      onSave({ id, word, translate, tags: result });

      setWord('');
      setTranslate('');
    }
  }, [id, onSave, word, translate, tagsIds, initialState?.tags]);

  const handleOnClickCancel = useCallback(() => {
    setWord('');
    setTranslate('');
    onCancel();
  }, [onCancel]);

  const handleChangeSuggestedTranslate = ({
    target: { checked = false } = {},
  }) => {
    fetchUpdateUserOptions({
      variables: {
        uid,
        userOptions: {
          useSuggestedTranslate: checked,
        },
      },
      optimisticResponse: {
        updateUserOptions: {
          uid,
          userOptions: {
            useSuggestedTranslate: checked,
            __typename: 'UserOptions',
          },
          __typename: 'User',
        },
      },
    }).then(() => {
      if (checked) fetchTranslate(word);
    });
  };

  useEffect(() => {
    if (useSuggestedTranslate) {
      setTranslate(suggestedTranslate);
    }
  }, [useSuggestedTranslate, suggestedTranslate]);

  return (
    <>
      <header className={styles.header}>Adding new word</header>
      <div className={styles.container}>
        <div className={styles.inputsContainer}>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="textAreaWord">
              <span>{t('DICTIONARY.NEW_WORD_WINDOW.WORD_PLACEHOLDER')}</span>
            </label>

            <textarea
              id="textAreaWord"
              data-testid="word"
              name="word"
              className={styles.input}
              value={word}
              onChange={handleOnChangeWord}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              rows={1}
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="textAreaTranslate">
              <span>
                {t('DICTIONARY.NEW_WORD_WINDOW.TRANSLATE_PLACEHOLDER')}
              </span>
              {loading && (
                <CircularProgress
                  className={styles.translateLoading}
                  style={{
                    width: '18px',
                    height: '18px',
                  }}
                />
              )}
            </label>

            <div className={styles.inputWrapper}>
              <textarea
                id="textAreaTranslate"
                data-testid="translate"
                name="translate"
                className={styles.input}
                value={translate}
                onChange={handleOnChangeTranslate}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={loading}
              />
            </div>
          </div>

          <label
            htmlFor="suggestedTranslate"
            className={`${styles.suggestedTranslateLabel} ${
              !useSuggestedTranslate && styles.unchecked
            }`}
          >
            <Checkbox
              id="suggestedTranslate"
              checked={useSuggestedTranslate}
              onChange={handleChangeSuggestedTranslate}
              color="primary"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              disableRipple
              style={{ backgroundColor: 'transparent', padding: '4px' }}
              size="small"
            />
            Suggest translate
          </label>

          <Tags wordId={id} tagsIds={tagsIds} setTags={setTagsIds} />
        </div>
        <div className={styles.buttons}>
          <SaveButton onSave={handleOnClickSave} />
          <CancelButton onCancel={handleOnClickCancel} />
        </div>
      </div>
    </>
  );
};

export default memo(NewWord);
