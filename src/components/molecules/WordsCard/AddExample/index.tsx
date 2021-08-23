import React, { memo, useCallback, useState, useRef } from 'react';
import { Tooltip } from '@chakra-ui/react';
import styles from './styles.module.css';
import SaveButton from '~c/molecules/NewWord/SaveButton';

type Props = {
  onSave: (example: string) => Promise<void>;
};

const AddExample: React.FunctionComponent<Props> = ({ onSave }: Props) => {
  const [example, setExample] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleOnSave = useCallback(async () => {
    if (!example) {
      setShowTooltip(true);
      return;
    }
    await onSave(example);
    setExample('');
  }, [onSave, example]);

  const handleChangeInput = useCallback((e) => {
    const { value } = e.target;
    setExample(value);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <textarea
          ref={textAreaRef}
          className={styles.input}
          value={example}
          onChange={handleChangeInput}
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
        >
          <span>
            <SaveButton onSave={handleOnSave} />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default memo(AddExample);
