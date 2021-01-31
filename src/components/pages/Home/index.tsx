import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Base from '~c/templates/Base';
import Cards from '~c/organisms/Cards';
import WordsForToday from '~c/organisms/WordsForToday';
import { HOME_WORDS, HOME_WORDS_FOR_TODAY } from '~router/paths';
import type { RootState } from '~store/rootReducer';
import { fetchWords } from '~actions/words';
import If from '~c/atoms/If';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Home: React.FunctionComponent = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ user: userData }: RootState) => userData);
  const words = useSelector(({ words: wordsData }: RootState) => wordsData);

  useEffect(() => {
    if (user.uid) {
      dispatch(fetchWords(user.uid));
    }
  }, [dispatch, user.uid]);

  return (
    <>
      <If condition={words.isLoading}>
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      </If>

      <Base>
        <Switch>
          <Route path={HOME_WORDS} component={Cards} />
          <Route path={HOME_WORDS_FOR_TODAY} component={WordsForToday} />
        </Switch>
      </Base>
    </>
  );
};

export default Home;
