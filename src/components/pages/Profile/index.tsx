import { FC } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { useQuery } from '@apollo/client';
import styles from './styles.module.css';
import useSelector from '~hooks/useSelector';
import { GetWordsQueryResult } from '~shared/types';
import getWordsQuery from '~graphql/queries/getWords';

const Profile: FC = () => {
  const photoURL = useSelector<string>('user.photoURL');
  const name = useSelector<string>('user.name');
  const email = useSelector<string>('user.email');
  const userId = useSelector<string>('user.uid');

  const {
    data: { user: { words = [] } = {} } = {},
    loading,
  } = useQuery<GetWordsQueryResult>(getWordsQuery, {
    variables: {
      uid: userId,
    },
  });

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
        {loading ? (
          <p>Loading ...</p>
        ) : (
          <>
            <p>Total: {words.length}</p>
            <p>Learned: {words.filter(({ step }) => step === 6).length}</p>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
