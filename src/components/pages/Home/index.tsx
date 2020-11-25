import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Base from '../../templates/Base';
import database from '../../../database';
import { setUser } from '../../../core/store/models/user';
import Cards from '../../organisms/Cards';

const Home: React.FunctionComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const checkCurrentUser = useCallback(async () => {
    database
      .auth()
      .onAuthStateChanged(
        (user: { uid: number; displayName?: string; email: string }) => {
          if (!user) {
            history.push('/login');
          } else {
            const {
              currentUser: { uid, displayName, email },
            } = database.auth();

            dispatch(
              setUser({
                user: {
                  uid,
                  displayName,
                  email,
                },
              })
            );
          }
        }
      );
  }, [history, dispatch]);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  return (
    <Base>
      <Cards />
    </Base>
  );
};

export default Home;
