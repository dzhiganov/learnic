import React, { useCallback, useEffect } from 'react';
import { useHistory, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Base from '../../templates/Base';
import database from '../../../database';
import { setUser } from '../../../core/store/models/user';
import Cards from '../../organisms/Cards';
import AsideMenu from '../../organisms/AsideMenu';
import { HOME_WORDS } from '../../../core/router/paths';
import WordsCard from '../../molecules/WordsCard';

const Home: React.FunctionComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const checkCurrentUser = useCallback(async () => {
    database.auth().onAuthStateChanged((user) => {
      if (!user) {
        history.push('/login');
      } else {
        const auth = database.auth();
        const { currentUser } = auth;
        const { uid, displayName, email } = (currentUser as unknown) as Record<
          string,
          string
        >;

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
    });
  }, [history, dispatch]);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  return (
    <Base>
      <AsideMenu />
      <Switch>
        <Route path={HOME_WORDS}>
          <Cards />
        </Route>
      </Switch>
    </Base>
  );
};

export default Home;
