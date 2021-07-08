/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import { useMutation, useQuery } from '@apollo/client';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import Popover from '@material-ui/core/Popover';
import useClickAway from 'react-use/lib/useClickAway';
import random from 'lodash.random';
import styles from './styles.module.css';
import useSelector from '~hooks/useSelector';
import updateWordMutation from '~graphql/mutations/updateWord';
import getUserTags from '~graphql/queries/getUserTags';
import getDefaultTags from '~graphql/queries/getDefaultTags';
import { Tags as TagsList } from '~shared/types';

type TagProps = {
  wordId: string;
  name: string;
  color?: string;
};

const defaultTagColor = '#000';

const Tag: React.FC<TagProps> = ({ wordId, name, color = defaultTagColor }) => {
  const userId = useSelector<string>('user.uid');
  const [fetchUpdate] = useMutation(updateWordMutation);

  const handleDelete = () => {
    fetchUpdate({
      variables: {
        uid: userId,
        id: wordId,
        updatedFields: {
          tags: `!REMOVE!_${name}`,
        },
      },
    });
  };

  return (
    <div className={styles.tag} style={{ background: color }}>
      {name}
      <button
        data-testid={`delete-${name}`}
        type="button"
        onClick={handleDelete}
        className={styles.iconButton}
      >
        <ClearIcon />
      </button>
    </div>
  );
};

const colors = [
  '#AF87CE',
  '#EA1A7F',
  '#FEC603',
  '#A8F387',
  '#16D6FA',
  '#6842EF',
  '#F2B5D4',
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
  wordId: string;
  setShowAddNewTag: (state: boolean) => void;
};

const pickRandomColor = () => colors[random(0, colors.length - 1)];

const NewTag: React.FC<NewTagProps> = ({ wordId, setShowAddNewTag }) => {
  const userId = useSelector<string>('user.uid');
  const [fetchUpdate] = useMutation(updateWordMutation);
  const [value, setValue] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [color, setColor] = useState<Color>(pickRandomColor);

  const open = Boolean(anchorEl);

  const handleChange = ({ target: { value: newValue = '' } = {} } = {}) =>
    setValue(newValue);

  const handleClickSave = () => {
    fetchUpdate({
      variables: {
        uid: userId,
        id: wordId,
        updatedFields: {
          tags: value,
        },
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

  return (
    <div
      className={styles.tag}
      data-testid="newTagContainer"
      style={{ background: color }}
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

const Tags: React.FC<{ wordId: string; tags?: TagsList }> = ({ wordId }) => {
  const uid = useSelector<string>('user.uid');
  const [showAddNewTag, setShowAddNewTag] = useState(false);

  const { data: { user: { tags: userTags = [] } = {} } = {} } = useQuery(
    getUserTags,
    {
      variables: {
        uid,
      },
    }
  );

  const { data: { defaultTags = [] } = {} } = useQuery(getDefaultTags);

  const handleClickNewTag = () => {
    setShowAddNewTag(true);
  };

  return (
    <div className={styles.container}>
      {[...defaultTags, ...userTags].map(
        ({ name: tagName, color: tagColor }) => (
          <Tag key={tagName} name={tagName} color={tagColor} wordId={wordId} />
        )
      )}
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
  );
};

export { NewTag, Tag };
export default Tags;
