import React, { memo, useState, useRef } from 'react';
import { Tooltip } from '@chakra-ui/react';
import styles from './styles.module.css';
import SaveButton from '~c/molecules/NewWord/SaveButton';

type Props = {
  onSave: (example: string) => Promise<void>;
};

let timer: ReturnType<typeof setTimeout> | null = null;
const tooltipShowTime = 4000;

const AddExample: React.FunctionComponent<Props> = ({ onSave }: Props) => {
  const [example, setExample] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleOnSave = () => {
    if (!example) {
      if (!showTooltip) {
        setShowTooltip(true);
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setShowTooltip(false);
        timer = null;
      }, tooltipShowTime);
      return;
    }
    onSave(example).then(() => setExample(''));
  };

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
            <SaveButton onSave={handleOnSave} />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default memo(AddExample);
