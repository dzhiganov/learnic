import React, { memo, useMemo } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './styles.module.css';

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#00af91',
    },
  })
)(LinearProgress);

type Props = {
  step: number;
  repeat: Date;
};

const StepsPopup: React.FunctionComponent<Props> = ({
  step,
  repeat,
}: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const repeatDate = useMemo(() => {
    const today = dayjs();
    const targetDate = dayjs(repeat);

    const isToday = targetDate <= today;

    if (isToday) {
      return t('DICTIONARY.WORD_CARD.STEPS.TODAY');
    }
    const result = `${
      repeat
        ? t('DICTIONARY.WORD_CARD.STEPS.NEXT_REPEAT_DATE', {
            date: new Date(repeat),
          })
        : ''
    }`;

    return result;
  }, [repeat, t]);

  return (
    <>
      <button
        className={styles.openStepsButton}
        type="button"
        onClick={handleClick}
      >
        <AccessAlarmIcon />
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={styles.popup}>
          <BorderLinearProgress
            variant="determinate"
            value={(100 / 6) * step}
          />
          <div className={styles.section}>
            <span className={styles.title}>{`${t(
              'DICTIONARY.WORD_CARD.STEPS.REPEAT'
            )}: `}</span>
            <span className={styles.value}>{`${step}/6`}</span>
          </div>
          {step < 6 ? (
            <div className={styles.section}>
              <span className={styles.title}>{`${t(
                'DICTIONARY.WORD_CARD.STEPS.NEXT_REPEAT'
              )}: `}</span>
              <span className={styles.value}>{repeatDate}</span>
            </div>
          ) : null}
        </div>
      </Popover>
    </>
  );
};

export default memo(StepsPopup);
