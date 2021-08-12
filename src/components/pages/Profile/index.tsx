import { FC } from 'react';
import Avatar from '@material-ui/core/Avatar';
import styles from './styles.module.css';
import useSelector from '~hooks/useSelector';

const Profile: FC = () => {
  const photoURL = useSelector<string>('user.photoURL');
  const name = useSelector<string>('user.name');
  const email = useSelector<string>('user.email');

  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside}>
        <Avatar src={photoURL} className={styles.avatar} />
        <div className={styles.userInfo}>
          <p>{name}</p>
          <p className={styles.email}> {email}</p>
        </div>
      </aside>
      <main className={styles.main}>
        <h2 className={styles.title}>Statistic</h2>
      </main>
    </div>
  );
};

export default Profile;
