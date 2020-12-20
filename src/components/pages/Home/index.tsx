import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Base from '../../templates/Base';
import Cards from '../../organisms/Cards';
import AsideMenu from '../../organisms/AsideMenu';
import { HOME_WORDS } from '../../../core/router/paths';

const Home: React.FunctionComponent = () => {
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
