import React from 'react';
import dayjs from 'dayjs';
import getIsYesterday from 'dayjs/plugin/isYesterday';
import getIsToday from 'dayjs/plugin/isToday';
import styles from './styles.module.css';

dayjs.extend(getIsToday);
dayjs.extend(getIsYesterday);

type Props = {
  strDate: string;
};

const now = dayjs();

const HeaderDate: React.FC<Props> = ({ strDate }) => {
  const date = dayjs(strDate);
  const isCurrentYear = now.isSame(date, 'year');
  const isToday = date.isToday();
  const isYesterday = date.isYesterday();

  const parsedDate = isCurrentYear
    ? date.format('DD MMMM')
    : date.format('DD MMMM YYYY');

  if (isToday) return <div className={styles.headerDate}>Today</div>;
  if (isYesterday) return <div className={styles.headerDate}>Yesterday</div>;

  return <div className={styles.headerDate}>{parsedDate}</div>;
};

export default HeaderDate;
