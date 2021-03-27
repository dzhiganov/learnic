import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { INDEX, HOME } from '~router/paths';

const Home = lazy(() => import('~c/pages/Home'));
const Landing = lazy(() => import('~c/pages/Landing'));

const SwitchRoute: React.FC = () => {
  return (
    <Switch>
      <Route exact path={INDEX} component={Landing} />
      <Route path={HOME} component={Home} />
    </Switch>
  );
};

export default SwitchRoute;
