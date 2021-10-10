import React, { useState } from 'react';
import Tag, { Status } from './Tag/Tag';
import useTags from './useTags';
import styles from './styles.module.css';
import UserTag from './UserTag/UserTag';
import NewTag from './NewTag/NewTag';

const Tags: React.FC<{
  wordId: string;
  tagsIds?: string[];
  setTags: (tags: string[]) => void;
  setSuggestedTag: (tag: string) => void;
  suggestedTag: string;
}> = ({ tagsIds = [], setTags, suggestedTag, setSuggestedTag }) => {
  const [defaultTags = [], userTags = []] = useTags();

  const toggleTag = (id: string) => {
    if (tagsIds.includes(id)) {
      setTags(tagsIds.filter((d) => d !== id));
    } else {
      setTags([...tagsIds, id]);
    }
  };

  const suggestedTagData = defaultTags.find(
    ({ name }) => suggestedTag === name
  );

  const [showAddNewTag, setShowAddNewTag] = useState(false);

  const handleClickNewTag = () => {
    setShowAddNewTag(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <div className={styles.labelContainer}>
          <span className={styles.label}>Tags</span>
          {suggestedTagData && (
            <Tag
              name={suggestedTagData.name}
              onClick={() => {
                setSuggestedTag('');
              }}
              status={Status.Suggested}
            />
          )}
        </div>
        <div className={styles.tagsContainer}>
          {defaultTags
            .filter((it) => it)
            .map(({ id, name }) => (
              <Tag
                key={id}
                name={name}
                onClick={() => toggleTag(id)}
                status={tagsIds.includes(id) ? Status.Active : Status.Inactive}
              />
            ))}
          {userTags
            .filter((it) => it)
            .map(({ id, name }) => (
              <UserTag
                tagId={id}
                key={id}
                name={name}
                onClick={() => toggleTag(id)}
                status={tagsIds.includes(id) ? Status.Active : Status.Inactive}
              />
            ))}
          {showAddNewTag ? (
            <NewTag onClose={() => setShowAddNewTag(false)} />
          ) : (
            <button
              className={styles.addNewTagButton}
              data-testid="addNewTagButton"
              type="button"
              onClick={handleClickNewTag}
            >
              New Tag
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tags;
