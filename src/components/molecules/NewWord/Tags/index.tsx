/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import { useMutation, useQuery } from '@apollo/client';
import CheckIcon from '@material-ui/icons/Check';
import { AddIcon } from '@chakra-ui/icons';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import Popover from '@material-ui/core/Popover';
import useClickAway from 'react-use/lib/useClickAway';
import random from 'lodash.random';
import produce from 'immer';
import styles from './styles.module.css';
import useSelector from '~hooks/useSelector';
import deleteUserTagMutation from '~graphql/mutations/deleteUserTag';
import getUserTags from '~graphql/queries/getUserTags';
import getDefaultTags from '~graphql/queries/getDefaultTags';
import addUserTag from '~graphql/mutations/addUserTag';
import { Tags as TagsList, GetTagQuerySelector } from '~shared/types';
import darker from './darker';

type UserTagProps = {
  tagId: string;
  name: string;
  color: string;
  onClick: (tagId: string) => void;
};

type TagProps = {
  name: string;
  color: string;
  onClick?: () => void;
};

const Tag: React.FC<TagProps> = ({ name, color, children, ...props }) => {
  const fontColor = darker(color);

  return (
    <div
      className={styles.tag}
      style={{ background: color, color: fontColor, borderColor: fontColor }}
      {...props}
    >
      {name}
      {children}
    </div>
  );
};

const UserTag: React.FC<UserTagProps> = ({ tagId, name, color, onClick }) => {
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

  const handleDelete = () => {
    fetchDelete({
      variables: {
        uid: userId,
        tagId,
      },
    });
  };

  const wrappedOnClick = () => onClick(tagId);

  return (
    <Tag name={name} color={color} onClick={wrappedOnClick}>
      <button
        data-testid={`delete-${name}`}
        type="button"
        onClick={handleDelete}
        className={styles.iconButton}
      >
        <ClearIcon />
      </button>
    </Tag>
  );
};

type DefaultTagProps = {
  id: string;
  color: string;
  name: string;
  onClick: (tagId: string) => void;
};
const DefaultTag: React.FC<DefaultTagProps> = ({
  id,
  color,
  name,
  onClick,
}) => {
  const wrappedOnClick = () => onClick(id);

  return <Tag name={name} color={color} onClick={wrappedOnClick} />;
};

const colors = [
  'hsl(357, 100%, 92%)', // pink
  'hsl(334, 100%, 92%)', // bright pink
  'hsl(263, 100%, 93%)', // purple
  'hsl(217, 100%, 91%)', // sky blue
  'hsl(202, 100%, 86%)', // light blue
  'hsl(180, 73%, 78%)', // cyan
  'hsl(136, 71%, 80%)', // green
  'hsl(0, 0%, 88%)', // grey
  'hsl(213, 15%, 88%)', // blue grey
] as const;

type Color = typeof colors[number];

type PaletteProps = {
  onClose: () => void;
  onPick: (color: Color) => void;
};

const Palette: React.FC<PaletteProps> = ({ onPick, onClose }) => {
  const containerRef = React.useRef(null);

  useClickAway(containerRef, onClose);

  return (
    <div ref={containerRef} className={styles.paletteContainer}>
      <ul className={styles.paletteList}>
        {colors.map((colorName) => {
          const onClick = () => onPick(colorName);

          return (
            <li
              onClick={onClick}
              key={colorName}
              className={styles.paletteItem}
              style={{ background: colorName }}
            />
          );
        })}
      </ul>
    </div>
  );
};

type NewTagProps = {
  wordId?: string;
  setShowAddNewTag: (state: boolean) => void;
};

const pickRandomColor = () => colors[random(0, colors.length - 1)];

const NewTag: React.FC<NewTagProps> = ({ setShowAddNewTag }) => {
  const userId = useSelector<string>('user.uid');
  const [fetchAddUserTag] = useMutation(addUserTag, {
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

  const [value, setValue] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [color, setColor] = useState<Color>(pickRandomColor);

  const open = Boolean(anchorEl);

  const handleChange = ({ target: { value: newValue = '' } = {} } = {}) =>
    setValue(newValue);

  const handleClickSave = () => {
    fetchAddUserTag({
      variables: {
        uid: userId,
        name: value,
        color,
      },
    }).then(() => setShowAddNewTag(false));
  };

  const handleOpenPalette = ({
    currentTarget,
  }: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(currentTarget);

  const handleClosePalette = () => setAnchorEl(null);

  const handlePickColor = (newColor: Color) => {
    setColor(newColor);
    handleClosePalette();
  };

  const fontColor = darker(color);

  return (
    <div
      className={`${styles.tag} ${styles.newTag}`}
      data-testid="newTagContainer"
      style={{
        background: color,
        color: fontColor,
        borderColor: fontColor,
      }}
    >
      <div className={styles.paletteWrapper}>
        <button
          type="button"
          onClick={handleOpenPalette}
          className={styles.iconButton}
        >
          <ColorLensIcon />
        </button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => {}}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Palette onClose={handleClosePalette} onPick={handlePickColor} />
        </Popover>
      </div>

      <input
        className={styles.newTagInput}
        value={value}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={handleClickSave}
        className={styles.iconButton}
      >
        <CheckIcon />
      </button>
    </div>
  );
};

type ActiveTagsProps = {
  activeTags: string[];
  allTags: TagsList;
  deleteTag: (tagId: string) => void;
};

const ActiveTags: React.FC<ActiveTagsProps> = ({
  activeTags,
  allTags,
  deleteTag,
}) => {
  const tags =
    allTags.length && activeTags.length
      ? (activeTags.map((id) =>
          allTags.find(({ id: checkId }) => id === checkId)
        ) as TagsList)
      : [];

  return (
    <div className={styles.inputContainer}>
      <span className={styles.label}>Word tags</span>
      <div className={styles.tagsContainer}>
        {tags
          .filter((it) => it)
          .map(({ id, name, color }) => (
            <Tag
              key={id}
              name={name}
              color={color}
              onClick={() => deleteTag(id)}
            />
          ))}
      </div>
    </div>
  );
};

const useTags = (wordTags: string[]) => {
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

  const allTags = [...defaultTags, ...userTags];

  useEffect(() => {
    if (!userTags.length && !defaultTags.length) return;
    if (!wordTags.length) {
      setVisibleUserTags(userTags);
      setVisibleDefaultTags(defaultTags);
    }

    if (userTags.length) {
      setVisibleUserTags(
        userTags.filter(({ id: tagId }) => !wordTags.includes(tagId))
      );
    }

    if (defaultTags.length) {
      setVisibleDefaultTags(
        defaultTags.filter(({ id: tagId }) => !wordTags.includes(tagId))
      );
    }
  }, [wordTags, userTags, defaultTags]);

  return [visibleDefaultTags, visibleUserTags, allTags];
};

const Tags: React.FC<{
  wordId: string;
  tagsIds?: string[];
  setTags: (tags: string[]) => void;
}> = ({ wordId, tagsIds = [], setTags }) => {
  const [showAddNewTag, setShowAddNewTag] = useState(false);
  const [defaultTags = [], userTags = [], allTags = []] = useTags(tagsIds);

  const handleClickNewTag = () => {
    setShowAddNewTag(true);
  };

  const addTagToWordTags = (newTagId: string) =>
    setTags([...tagsIds, newTagId]);

  const deleteTagFromWordTags = (deleteTagId: string) =>
    setTags(tagsIds.filter((id) => id !== deleteTagId));

  return (
    <div className={styles.container}>
      <ActiveTags
        activeTags={tagsIds}
        allTags={allTags}
        deleteTag={deleteTagFromWordTags}
      />
      <div className={styles.inputContainer}>
        <span className={styles.label}>All tags</span>
        <div className={styles.tagsContainer}>
          {defaultTags.map(({ id, name: tagName, color: tagColor }) => (
            <DefaultTag
              key={id}
              id={id}
              name={tagName}
              color={tagColor}
              onClick={addTagToWordTags}
            />
          ))}
          {userTags.map(({ id, name: tagName, color: tagColor }) => (
            <UserTag
              key={tagName}
              name={tagName}
              color={tagColor}
              tagId={id}
              onClick={addTagToWordTags}
            />
          ))}
          {showAddNewTag ? (
            <NewTag wordId={wordId} setShowAddNewTag={setShowAddNewTag} />
          ) : (
            <button
              className={styles.addNewTagButton}
              data-testid="addNewTagButton"
              type="button"
              onClick={handleClickNewTag}
            >
              <AddIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { NewTag, Tag };
export default Tags;
