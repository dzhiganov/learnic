import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Base from '~c/templates/Base';
import Dictionary from '~c/pages/Dictionary';
import { HOME_WORDS, HOME_CARDS } from '~router/paths';
import { fetchWords } from '~actions/words';
import If from '~c/atoms/If';
import Cards from '~c/pages/Cards';
import useSelector from '~hooks/useSelector';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userId = useSelector<string>('user.uid');
  const wordsIsLoading = useSelector<boolean>('words.isLoading');

  useEffect(() => {
    if (userId) {
      dispatch(fetchWords(userId));
    }
  }, [dispatch, userId]);

  return (
    <>
      <If condition={wordsIsLoading}>
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      </If>

      <Base>
        <Switch>
          <Route path={HOME_WORDS} component={Dictionary} />
          <Route path={HOME_CARDS} component={Cards} />
        </Switch>
      </Base>
    </>
  );
};

export default Home;
