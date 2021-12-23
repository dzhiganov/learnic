import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Base from '~c/templates/Base';
import Dictionary from '~c/pages/Dictionary';
import { HOME_WORDS, HOME_PROFILE, HOME_CARDS_$CARD_ID } from '~router/paths';
import Profile from '~c/pages/Profile';
import Cards from '~c/pages/Cards';

const Home: React.FC = () => {
  return (
    <Base>
      <Switch>
        <Route path={HOME_WORDS} component={Dictionary} />
        <Route path={HOME_CARDS_$CARD_ID} component={Cards} />
        <Route path={HOME_PROFILE} component={Profile} />
      </Switch>
    </Base>
  );
};

export default Home;
