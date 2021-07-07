/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import { useMutation } from '@apollo/client';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import Popover from '@material-ui/core/Popover';
import useClickAway from 'react-use/lib/useClickAway';
import styles from './styles.module.css';
import useSelector from '~hooks/useSelector';
import updateWordMutation from '~graphql/mutations/updateWord';
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

type PaletteProps = {
  onClose: () => void;
};

const Palette: React.FC<PaletteProps> = ({ onClose }) => {
  const containerRef = React.useRef(null);

  const colors = [
    'aqua',
    'aquamarine',
    'cadetblue',
    'yellow',
    'violet',
    'tomato',
    'tan',
    'skyblue',
    'lightgreen',
  ];

  useClickAway(containerRef, onClose);

  return (
    <div ref={containerRef} className={styles.paletteContainer}>
      <ul className={styles.paletteList}>
        {colors.map((colorName) => (
          <li
            key={colorName}
            className={styles.paletteItem}
            style={{ background: colorName }}
          />
        ))}
      </ul>
    </div>
  );
};

type NewTagProps = {
  wordId: string;
  setShowAddNewTag: (state: boolean) => void;
};

const NewTag: React.FC<NewTagProps> = ({ wordId, setShowAddNewTag }) => {
  const userId = useSelector<string>('user.uid');
  const [fetchUpdate] = useMutation(updateWordMutation);
  const [value, setValue] = useState('');
  const [paletteOpened, setPaletteOpen] = React.useState(null);

  const open = Boolean(paletteOpened);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenPalette = (event: any) => {
    setPaletteOpen(event.currentTarget);
  };

  return (
    <div className={styles.tag} data-testid="newTagContainer">
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
          anchorEl={paletteOpened}
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
          <Palette onClose={() => setPaletteOpen(null)} />
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

const Tags: React.FC<{ wordId: string; tags?: TagsList }> = ({
  wordId,
  tags = [],
}) => {
  const [showAddNewTag, setShowAddNewTag] = useState(false);

  const handleClickNewTag = () => {
    setShowAddNewTag(true);
  };

  return (
    <div className={styles.container}>
      {tags.map(({ name: tagName, color: tagColor }) => (
        <Tag key={tagName} name={tagName} color={tagColor} wordId={wordId} />
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
  );
};

export { NewTag, Tag };
export default Tags;
