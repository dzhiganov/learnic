import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Base from '../../templates/Base';
import Cards from '../../organisms/Cards';
import WordsForToday from '../../organisms/WordsForToday';
import AsideMenu from '../../organisms/AsideMenu';
import { HOME_WORDS, HOME_WORDS_FOR_TODAY } from '../../../core/router/paths';

const Home: React.FunctionComponent = () => {
  return (
    <Base>
      <AsideMenu />
      <Switch>
        <Route path={HOME_WORDS} component={Cards} />
        <Route path={HOME_WORDS_FOR_TODAY} component={WordsForToday} />
      </Switch>
    </Base>
  );
};

export default Home;
