import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import Backdrop from '@material-ui/core/Backdrop';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import { makeStyles } from '@material-ui/core/styles';
import Base from '~c/templates/Base';
import Dictionary from '~c/pages/Dictionary';
import { HOME_WORDS, HOME_CARDS } from '~router/paths';

import Cards from '~c/pages/Cards';

// const useStyles = makeStyles((theme) => ({
//   backdrop: {
//     zIndex: theme.zIndex.drawer + 1,
//     color: '#fff',
//   },
// }));

// const Loading = (
//   <If condition={wordsIsLoading}>
//     <Backdrop className={classes.backdrop} open>
//       <CircularProgress color="inherit" />
//     </Backdrop>
//   </If>
// );

const Home: React.FC = () => {
  // const classes = useStyles();

  return (
    <Base>
      <Switch>
        <Route path={HOME_WORDS} component={Dictionary} />
        <Route path={HOME_CARDS} component={Cards} />
      </Switch>
    </Base>
  );
};

export default Home;
