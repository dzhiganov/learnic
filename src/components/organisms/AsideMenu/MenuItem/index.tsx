import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LocalLibraryOutlinedIcon from '@material-ui/icons/LocalLibraryOutlined';
import ViewCarouselOutlinedIcon from '@material-ui/icons/ViewCarouselOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import styles from './styles.module.css';

const icons = {
  dictionary: LocalLibraryOutlinedIcon,
  cards: ViewCarouselOutlinedIcon,
  profile: PersonOutlineOutlinedIcon,
};

type Props = {
  id: string;
  title: string;
  to: string;
  isWide: boolean;
};

const MenuItem: React.FunctionComponent<Props> = ({
  id,
  title,
  to,
  isWide,
}: Props) => {
  const { t } = useTranslation();
  const IconComponent = icons[id as keyof typeof icons];

  return (
    <Link className={styles.link} to={to} data-testid="page-link">
      <li className={`${styles.item}`}>
        <div className={styles.itemWrapper}>
          {!isWide && <IconComponent />}
          <span className={styles.title}>{t(title)}</span>
        </div>
      </li>
    </Link>
  );
};

export default memo(MenuItem);
